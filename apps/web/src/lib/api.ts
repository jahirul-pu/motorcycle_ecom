import { useAuthStore } from '@/store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface FetchOptions extends RequestInit {
  body?: any;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
}

async function request(path: string, options: FetchOptions = {}): Promise<any> {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const headers = new Headers(options.headers || {});

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const { accessToken, refreshToken, setCredentials, clearCredentials } = useAuthStore.getState();
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    body:
      options.body && !(options.body instanceof FormData) && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
  };

  const response = await fetch(url, config);

  if (
    response.status === 401 &&
    refreshToken &&
    path !== '/auth/refresh' &&
    path !== '/auth/login'
  ) {
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((token) => {
          const retryHeaders = new Headers(options.headers || {});
          retryHeaders.set('Authorization', `Bearer ${token}`);
          resolve(request(path, { ...options, headers: retryHeaders }));
        });
      });
    }

    isRefreshing = true;

    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Refresh failed');
      }

      const data = await refreshResponse.json();
      const user = useAuthStore.getState().user;
      if (user) {
        setCredentials(user, data.accessToken, data.refreshToken);
      }

      isRefreshing = false;
      onRefreshed(data.accessToken);

      const retryHeaders = new Headers(options.headers || {});
      retryHeaders.set('Authorization', `Bearer ${data.accessToken}`);
      return request(path, { ...options, headers: retryHeaders });
    } catch (err) {
      isRefreshing = false;
      clearCredentials();
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'API request failed');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

export const api = {
  get: (path: string, options?: FetchOptions) => request(path, { ...options, method: 'GET' }),
  post: (path: string, body?: any, options?: FetchOptions) =>
    request(path, { ...options, method: 'POST', body }),
  patch: (path: string, body?: any, options?: FetchOptions) =>
    request(path, { ...options, method: 'PATCH', body }),
  delete: (path: string, options?: FetchOptions) => request(path, { ...options, method: 'DELETE' }),
};

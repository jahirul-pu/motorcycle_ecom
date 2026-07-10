import { api } from '@/lib/api';
import type { Notification } from '@motohub/types';

export const notificationsService = {
  getNotifications: (): Promise<Notification[]> => api.get('/notifications'),
  markAllAsRead: (): Promise<{ success: boolean }> => api.patch('/notifications/read-all'),
  markAsRead: (id: string): Promise<Notification> => api.patch(`/notifications/${id}/read`),
};

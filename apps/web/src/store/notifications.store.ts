import { create } from 'zustand';
import type { Notification } from '@motohub/types';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.isRead).length,
    }),
  markRead: (id) =>
    set((state) => {
      const next = state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      return {
        notifications: next,
        unreadCount: next.filter((n) => !n.isRead).length,
      };
    }),
  markAllRead: () =>
    set((state) => {
      const next = state.notifications.map((n) => ({ ...n, isRead: true }));
      return {
        notifications: next,
        unreadCount: 0,
      };
    }),
}));

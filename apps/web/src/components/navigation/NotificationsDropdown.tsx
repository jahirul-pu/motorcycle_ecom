'use client';

import * as React from 'react';
import { Bell, Check, MailOpen } from 'lucide-react';

import { useNotificationsStore } from '@/store/notifications.store';
import { useAuthStore } from '@/store/auth.store';
import { notificationsService } from '@/services/notifications.service';
import { toast } from 'sonner';

export default function NotificationsDropdown() {
  const { notifications, unreadCount, setNotifications, markRead, markAllRead } =
    useNotificationsStore();
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);

    if (isAuthenticated) {
      notificationsService
        .getNotifications()
        .then(setNotifications)
        .catch(() => {});
    }

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      if (isAuthenticated) {
        notificationsService
          .getNotifications()
          .then(setNotifications)
          .catch(() => {});
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, setNotifications]);

  // Click outside listener
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await notificationsService.markAsRead(id);
      markRead(id);
    } catch {
      toast.error('Failed to update notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      markAllRead();
      toast.success('All notifications marked as read');
    } catch {
      toast.error('Failed to update notifications');
    }
  };

  const count = mounted ? unreadCount : 0;

  if (!isAuthenticated) return null;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className={`relative inline-flex items-center justify-center rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${
          isOpen ? 'bg-zinc-100 text-zinc-900' : ''
        }`}
      >
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 z-50 w-80 origin-top-right rounded-xl border border-zinc-200 bg-white shadow-xl focus:outline-none animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
            <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-1.5">
              Notifications
              {count > 0 && (
                <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {count} new
                </span>
              )}
            </h3>
            {count > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                <Check className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-zinc-50">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <MailOpen className="h-10 w-10 text-zinc-200 mb-2" />
                <p className="text-xs font-semibold text-zinc-500">No notifications</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  We will let you know when something happens!
                </p>
              </div>
            ) : (
              notifications.map((n) => {
                const date = new Date(n.createdAt).toLocaleDateString('en-BD', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-2.5 p-3.5 transition-colors relative hover:bg-zinc-50 ${
                      !n.isRead ? 'bg-primary/[0.03]' : ''
                    }`}
                  >
                    {!n.isRead && (
                      <span className="absolute left-2.5 top-5 h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                    <div className="flex-1 min-w-0 pl-1.5">
                      <p className="text-xs font-bold text-zinc-800 leading-tight">{n.title}</p>
                      <p className="text-[11px] text-zinc-500 mt-1 leading-normal">{n.message}</p>
                      <span className="text-[9px] text-zinc-400 mt-1.5 block">{date}</span>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(n.id, e)}
                        title="Mark as read"
                        className="shrink-0 rounded p-1 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all"
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-zinc-100 px-4 py-2 text-center bg-zinc-50/50 rounded-b-xl">
            <span className="text-[10px] text-zinc-400">Powered by MotoHub Notifications</span>
          </div>
        </div>
      )}
    </div>
  );
}

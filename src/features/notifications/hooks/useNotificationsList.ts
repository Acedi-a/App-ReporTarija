import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { useNotifications } from '@/src/shared/hooks/useNotifications';
import { getMyNotifications, markNotificationAsRead } from '@/src/features/notifications/services/notificationService';
import type { Notification } from '@/src/shared/types';

export function useNotificationsList() {
  const { user } = useAuth();
  const { refreshUnreadCount } = useNotifications();
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async (isSilent = false) => {
    if (!user?.id) return;
    if (!isSilent) setLoading(true);

    try {
      const data = await getMyNotifications(user.id);
      setNotifications(data);
      refreshUnreadCount();
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, refreshUnreadCount]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications(true);
  }, [loadNotifications]);

  async function handleNotificationPress(notification: Notification) {
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
        );
        refreshUnreadCount();
      } catch (err) {
        console.error('Error al marcar notificación como leída:', err);
      }
    }

    if (notification.report_id) {
      router.push({
        pathname: '/report/[id]',
        params: { id: notification.report_id },
      });
    }
  }

  return {
    notifications,
    loading,
    refreshing,
    handleRefresh,
    handleNotificationPress,
  };
}

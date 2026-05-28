import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getMyNotifications } from '../../features/notifications/services/notificationService';

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    if (!user?.id) {
      setUnreadCount(0);
      return;
    }
    try {
      const data = await getMyNotifications(user.id);
      const unread = data.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error al actualizar contador de notificaciones:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshUnreadCount();

    // Polling cada 15 segundos para mantener el contador al día
    const interval = setInterval(() => {
      refreshUnreadCount();
    }, 15000);

    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de un NotificationProvider');
  }
  return context;
}

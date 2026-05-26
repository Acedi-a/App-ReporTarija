// ============================================================
// NotificationsScreen - Avisos internos del ciudadano
// Lista notificaciones sobre cambios de estado en sus reportes
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { getMyNotifications, markNotificationAsRead } from '@/src/features/notifications/services/notificationService';
import type { Notification } from '@/src/shared/types';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { formatDate } from '@/src/shared/utils/date';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '@/src/shared/constants/theme';

export default function NotificationsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async (isSilent = false) => {
    if (!user?.id) return;
    if (!isSilent) setLoading(true);

    try {
      const data = await getMyNotifications(user.id);
      setNotifications(data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotifications(true);
  }, [loadNotifications]);

  async function handleNotificationPress(notification: Notification) {
    // 1. Si no está leída, marcarla como leída en base de datos
    if (!notification.is_read) {
      try {
        await markNotificationAsRead(notification.id);
        // Actualizar estado local
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
        );
      } catch (err) {
        console.error('Error al marcar notificación como leída:', err);
      }
    }

    // 2. Si tiene report_id asociado, navegar al detalle del reporte
    if (notification.report_id) {
      router.push({
        pathname: '/report/[id]',
        params: { id: notification.report_id },
      });
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'SUCCESS':
        return { name: 'checkmark-circle' as const, color: Colors.success };
      case 'WARNING':
        return { name: 'warning' as const, color: Colors.warning };
      case 'ERROR':
        return { name: 'alert-circle' as const, color: Colors.error };
      case 'INFO':
      default:
        return { name: 'information-circle' as const, color: Colors.primary };
    }
  }

  return (
    <ScreenContainer scrollable={false}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Notificaciones</Text>
        <Text style={styles.subtitle}>
          Entérate de las últimas novedades sobre tus reportes ciudadanos.
        </Text>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loaderText}>Cargando notificaciones...</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
              />
            }
            renderItem={({ item }) => {
              const iconInfo = getNotificationIcon(item.type);
              return (
                <TouchableOpacity
                  style={[
                    styles.notificationCard,
                    !item.is_read && styles.notificationUnread,
                  ]}
                  onPress={() => handleNotificationPress(item)}
                  activeOpacity={0.8}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name={iconInfo.name} size={24} color={iconInfo.color} />
                  </View>
                  <View style={styles.textContainer}>
                    <View style={styles.cardHeader}>
                      <Text style={[styles.cardTitle, !item.is_read && styles.boldText]}>
                        {item.title}
                      </Text>
                      <Text style={styles.cardDate}>{formatDate(item.created_at)}</Text>
                    </View>
                    <Text style={styles.cardMessage} numberOfLines={2}>
                      {item.message}
                    </Text>
                  </View>
                  {!item.is_read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>Todo al día</Text>
                <Text style={styles.emptySubtitle}>
                  No tienes notificaciones pendientes por el momento.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  listContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
    gap: Spacing.sm,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  loaderText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    ...Shadows.sm,
  },
  notificationUnread: {
    borderColor: Colors.primarySoft,
    backgroundColor: `${Colors.primary}05`, // 5% opacity primary
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  boldText: {
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  cardDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  cardMessage: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    position: 'absolute',
    right: Spacing.sm,
    top: Spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.xs,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    maxWidth: '80%',
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Notification } from '@/src/shared/types';
import { formatDate } from '@/src/shared/utils/date';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '@/src/shared/constants/theme';

interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

/** Configuración de iconos y colores de notificaciones por tipo */
const NOTIFICATION_TYPE_CONFIG: Record<
  Notification['type'],
  { name: keyof typeof Ionicons.glyphMap; color: string }
> = {
  SUCCESS: { name: 'checkmark-circle', color: Colors.success },
  WARNING: { name: 'warning', color: Colors.warning },
  ERROR: { name: 'alert-circle', color: Colors.error },
  INFO: { name: 'information-circle', color: Colors.primary },
};

const CARD_ICON_SIZE = 24;

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const config = NOTIFICATION_TYPE_CONFIG[notification.type] || NOTIFICATION_TYPE_CONFIG.INFO;

  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !notification.is_read && styles.notificationUnread,
      ]}
      onPress={() => onPress(notification)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={config.name} size={CARD_ICON_SIZE} color={config.color} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, !notification.is_read && styles.boldText]}>
            {notification.title}
          </Text>
          <Text style={styles.cardDate}>{formatDate(notification.created_at)}</Text>
        </View>
        <Text style={styles.cardMessage} numberOfLines={2}>
          {notification.message}
        </Text>
      </View>
      {!notification.is_read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );
}

const UNREAD_DOT_SIZE = 8;

const styles = StyleSheet.create({
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
    backgroundColor: `${Colors.primary}05`,
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
    width: UNREAD_DOT_SIZE,
    height: UNREAD_DOT_SIZE,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    position: 'absolute',
    right: Spacing.sm,
    top: Spacing.md,
  },
});

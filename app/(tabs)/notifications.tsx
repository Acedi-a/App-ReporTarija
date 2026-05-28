import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { Colors, FontSize, FontWeight, Spacing } from '@/src/shared/constants/theme';
import { useNotificationsList } from '@/src/features/notifications/hooks/useNotificationsList';
import { NotificationCard } from '@/src/features/notifications/components/NotificationCard';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const {
    notifications,
    loading,
    refreshing,
    handleRefresh,
    handleNotificationPress,
  } = useNotificationsList();

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
            renderItem={({ item }) => (
              <NotificationCard
                notification={item}
                onPress={handleNotificationPress}
              />
            )}
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

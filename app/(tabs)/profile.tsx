import { Button } from '@/src/shared/components/ui/Button';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { getUserRank } from '@/src/shared/constants/reputation';
import { BorderRadius, Colors, FontSize, FontWeight, Shadows, Spacing } from '@/src/shared/constants/theme';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { user, isDemo, logout } = useAuth();

  const points = user?.reputation_points || 0;
  const rank = getUserRank(points);

  return (
    <ScreenContainer>
      <Text style={styles.screenTitle}>Mi Perfil</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.userName}>{user?.full_name || 'Ciudadano'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>

        <View style={styles.rankContainer}>
          <View style={[styles.rankBadge, { backgroundColor: rank.color + '15' }]}>
            <Ionicons name={rank.icon} size={14} color={rank.color} />
            <Text style={[styles.rankText, { color: rank.color }]}>{rank.name}</Text>
          </View>
          <Text style={styles.pointsText}>{points} pts de reputación</Text>
        </View>

        {isDemo && (
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>Modo Demo</Text>
          </View>
        )}
      </View>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color={Colors.textMuted} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Correo</Text>
            <Text style={styles.infoValue}>{user?.email || '-'}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color={Colors.textMuted} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Teléfono</Text>
            <Text style={styles.infoValue}>{user?.phone || 'No registrado'}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textMuted} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Rol</Text>
            <Text style={styles.infoValue}>Ciudadano</Text>
          </View>
        </View>
      </View>

      <Button
        title="Cerrar sesión"
        onPress={logout}
        variant="danger"
        icon={<Ionicons name="log-out-outline" size={20} color={Colors.textInverse} />}
        style={styles.logoutButton}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  userEmail: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },
  demoBadge: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  demoBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.warning,
  },
  rankContainer: {
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: 4,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  rankText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  pointsText: {
    fontSize: FontSize.xs - 1,
    color: Colors.textMuted,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing['2xl'],
    ...Shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  logoutButton: {
    marginTop: Spacing.sm,
  },
});

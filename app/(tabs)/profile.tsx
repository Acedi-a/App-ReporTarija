// ============================================================
// ProfileScreen - Pantalla de perfil básico con logout
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { Button } from '@/src/shared/components/ui/Button';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { Colors, FontSize, FontWeight, Spacing, Shadows, BorderRadius } from '@/src/shared/constants/theme';

export default function ProfileScreen() {
  const { user, isDemo, logout } = useAuth();

  return (
    <ScreenContainer>
      <Text style={styles.screenTitle}>Mi Perfil</Text>

      {/* Avatar + Nombre */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.userName}>{user?.full_name || 'Ciudadano'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        {isDemo && (
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>Modo Demo</Text>
          </View>
        )}
      </View>

      {/* Info */}
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

      {/* Logout */}
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

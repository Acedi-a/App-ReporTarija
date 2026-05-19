// ============================================================
// HomeScreen - Pantalla de inicio (placeholder)
// Se implementará completamente en la próxima fase
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { Button } from '@/src/shared/components/ui/Button';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { Colors, FontSize, FontWeight, Spacing, Shadows, BorderRadius } from '@/src/shared/constants/theme';

export default function HomeScreen() {
  const { user, isDemo } = useAuth();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>¡Hola, {user?.full_name?.split(' ')[0] || 'Ciudadano'}! 👋</Text>
          <Text style={styles.subtitle}>Bienvenido a ReporTarija</Text>
        </View>
        {isDemo && (
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>DEMO</Text>
          </View>
        )}
      </View>

      <View style={styles.heroCard}>
        <Ionicons name="megaphone" size={40} color={Colors.primary} />
        <Text style={styles.heroTitle}>¿Ves un problema en tu ciudad?</Text>
        <Text style={styles.heroDescription}>
          Reporta baches, alumbrado dañado, basura acumulada y más. Tu reporte llegará al municipio.
        </Text>
        <Button
          title="Nuevo Reporte"
          onPress={() => {}}
          icon={<Ionicons name="add-circle-outline" size={20} color={Colors.textInverse} />}
          style={styles.heroButton}
        />
      </View>

      <Text style={styles.sectionTitle}>Próximamente</Text>
      <View style={styles.placeholderCard}>
        <Ionicons name="bar-chart-outline" size={24} color={Colors.textMuted} />
        <Text style={styles.placeholderText}>
          Aquí verás el resumen de tus reportes y actividad reciente
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  greeting: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  demoBadge: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  demoBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.warning,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'],
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
    ...Shadows.md,
  },
  heroTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  heroDescription: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  heroButton: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  placeholderCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing['2xl'],
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

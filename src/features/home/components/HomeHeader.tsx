// ============================================================
// HomeHeader - Encabezado de la pantalla de inicio
// Muestra saludo + badge demo si aplica
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../../shared/constants/theme';

interface HomeHeaderProps {
  userName: string;
  isDemo: boolean;
}

export function HomeHeader({ userName, isDemo }: HomeHeaderProps) {
  const firstName = userName?.split(' ')[0] || 'Ciudadano';

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Text style={styles.greeting}>Hola, {firstName} 👋</Text>
        <Text style={styles.subtitle}>Ayuda a mejorar tu ciudad</Text>
      </View>

      <View style={styles.right}>
        {isDemo && (
          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>DEMO</Text>
          </View>
        )}
        <View style={styles.avatarOuter}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={22} color={Colors.primary} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  left: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
    fontWeight: FontWeight.medium,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  demoBadge: {
    backgroundColor: Colors.warningLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  demoBadgeText: {
    fontSize: 10,
    fontWeight: FontWeight.bold,
    color: Colors.warning,
  },
  avatarOuter: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

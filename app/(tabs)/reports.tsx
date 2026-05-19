// ============================================================
// MyReportsScreen - Placeholder
// Se implementará en la próxima fase
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/src/shared/components/ui/ScreenContainer';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '@/src/shared/constants/theme';

export default function MyReportsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text-outline" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.title}>Mis Reportes</Text>
        <Text style={styles.subtitle}>
          Próximamente verás todos tus reportes aquí
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['3xl'],
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});

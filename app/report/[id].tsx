// ============================================================
// ReportDetailScreen - Placeholder
// Se implementará en la próxima fase
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, FontSize, FontWeight, Spacing } from '@/src/shared/constants/theme';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del Reporte</Text>
      <Text style={styles.subtitle}>ID: {id}</Text>
      <Text style={styles.placeholder}>
        Próximamente verás el detalle completo del reporte aquí
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing['3xl'],
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  placeholder: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

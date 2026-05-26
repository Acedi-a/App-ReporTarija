import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ReportStatus } from '../../../shared/types';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
} from '../../../shared/constants/theme';

interface CitizenStatsCardProps {
  stats: Record<ReportStatus, number>;
  onVerTodos?: () => void;
}

import { getStatusConfig } from '../../../shared/constants/reportStatus';

export function CitizenStatsCard({ stats, onVerTodos }: CitizenStatsCardProps) {
  const visibleKeys: ('PENDIENTE' | 'EN_REVISION' | 'EN_PROCESO' | 'RESUELTO')[] = [
    'PENDIENTE',
    'EN_REVISION',
    'EN_PROCESO',
    'RESUELTO',
  ];

  return (
    <View style={styles.container}>
      {/* Encabezado de la sección */}
      <View style={styles.header}>
        <Text style={styles.title}>Resumen de reportes</Text>
        {onVerTodos && (
          <TouchableOpacity onPress={onVerTodos} style={styles.linkButton} activeOpacity={0.7}>
            <Text style={styles.linkText}>Ver todos</Text>
            <Ionicons name="chevron-forward" size={14} color="#0D9488" />
          </TouchableOpacity>
        )}
      </View>

      {/* Grid de 4 tarjetas */}
      <View style={styles.grid}>
        {visibleKeys.map((status) => {
          const config = getStatusConfig(status);
          const count = stats[status] || 0;

          return (
            <View
              key={status}
              style={[styles.card, { backgroundColor: config.backgroundColor }]}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name={config.ionicon as any} size={20} color={config.color} />
              </View>
              <View style={styles.contentWrapper}>
                <Text style={styles.label} numberOfLines={1}>
                  {config.label}
                </Text>
                <Text style={[styles.count, { color: config.color }]}>
                  {count}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: '#0D9488',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    gap: 4,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 9,
    fontWeight: FontWeight.semibold,
    color: '#4B5563',
  },
  count: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    marginTop: 1,
  },
});

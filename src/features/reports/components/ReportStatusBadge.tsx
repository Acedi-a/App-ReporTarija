// ============================================================
// ReportStatusBadge - Badge de estado de reporte
// Componente reutilizable que muestra el estado con color
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ReportStatus } from '../../../shared/types';
import { getStatusConfig } from '../../../shared/constants/reportStatus';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../../shared/constants/theme';

interface ReportStatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

export function ReportStatusBadge({ status, size = 'md' }: ReportStatusBadgeProps) {
  const config = getStatusConfig(status);

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.backgroundColor },
        size === 'sm' && styles.badgeSm,
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text
        style={[
          styles.text,
          { color: config.color },
          size === 'sm' && styles.textSm,
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    gap: Spacing.xs,
  },
  badgeSm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  textSm: {
    fontSize: 10,
  },
});

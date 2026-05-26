// ============================================================
// ReportCard - Card de reporte para listas
// Muestra título, categoría, estado, fecha y dirección
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Report } from '../../../shared/types';
import { ReportStatusBadge } from './ReportStatusBadge';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadows,
} from '../../../shared/constants/theme';
import { formatDate } from '../../../shared/utils/date';
import { getCategoryConfig } from '../../../shared/constants/categories';

interface ReportCardProps {
  report: Report;
  onPress: (report: Report) => void;
}

export function ReportCard({ report, onPress }: ReportCardProps) {
  const categoryName = report.categories?.name || 'Sin categoría';
  const categoryCode = report.categories?.code || '';
  const categoryConfig = getCategoryConfig(categoryCode || categoryName);

  const iconBg = categoryConfig.backgroundColor;
  const iconColor = categoryConfig.color;
  const categoryIcon = categoryConfig.icon;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(report)}
      activeOpacity={0.7}
    >
      {/* Icono de categoría */}
      <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
        <Ionicons name={categoryIcon} size={22} color={iconColor} />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {report.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={[styles.category, { color: iconColor }]} numberOfLines={1}>
            {categoryName}
          </Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.date}>{formatDate(report.created_at)}</Text>
        </View>

        {(report.address || report.neighborhood) && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.location} numberOfLines={1}>
              {report.address || report.neighborhood}
            </Text>
          </View>
        )}
      </View>

      {/* Badge de estado a la derecha */}
      <View style={{ marginRight: 2 }}>
        <ReportStatusBadge status={report.status} size="sm" />
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  category: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  separator: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  location: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});

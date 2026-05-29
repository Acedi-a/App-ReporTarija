import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getCategoryConfig } from '../../../shared/constants/categories';
import { BorderRadius, Colors, FontSize, FontWeight, Shadows, Spacing } from '../../../shared/constants/theme';
import type { Report } from '../../../shared/types';
import { formatDate } from '../../../shared/utils/date';
import { ReportStatusBadge } from './ReportStatusBadge';

interface ReportDetailCardProps {
  report: Report;
}

export function ReportDetailCard({ report }: ReportDetailCardProps) {
  const categoryName = report.categories?.name || 'Sin categoría';
  const categoryCode = report.categories?.code || '';
  const categoryConfig = getCategoryConfig(categoryCode || categoryName);

  return (
    <View style={styles.card}>
      <View style={styles.categoryRow}>
        <View style={styles.categoryBadge}>
          <Ionicons name={categoryConfig.icon} size={16} color={Colors.primary} />
          <Text style={styles.categoryText}>{categoryName}</Text>
        </View>
        <ReportStatusBadge status={report.status} />
      </View>

      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.date}>Enviado el {formatDate(report.created_at)}</Text>

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>Descripción del problema</Text>
      <Text style={styles.description}>{report.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.primary}10`,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  categoryText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 4,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

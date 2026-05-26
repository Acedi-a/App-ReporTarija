import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Report } from '../../../shared/types';
import { ReportCard } from '../../reports/components/ReportCard';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../../shared/constants/theme';

interface RecentReportsListProps {
  reports: Report[];
  onReportPress: (report: Report) => void;
  onVerTodos?: () => void;
}

export function RecentReportsList({ reports, onReportPress, onVerTodos }: RecentReportsListProps) {
  if (reports.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons name="document-text-outline" size={40} color={Colors.textMuted} />
        </View>
        <Text style={styles.emptyTitle}>Sin reportes aún</Text>
        <Text style={styles.emptySubtitle}>
          Crea tu primer reporte para ver tu actividad aquí
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reportes recientes</Text>
        {onVerTodos && (
          <TouchableOpacity onPress={onVerTodos} style={styles.linkButton} activeOpacity={0.7}>
            <Text style={styles.linkText}>Ver todos</Text>
            <Ionicons name="chevron-forward" size={14} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {reports.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          onPress={onReportPress}
        />
      ))}
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
    color: '#6B7280',
    fontWeight: FontWeight.semibold,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing['2xl'],
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});


import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  BorderRadius,
  Colors,
  FontSize,
  FontWeight,
  Shadows,
  Spacing,
} from '../../../shared/constants/theme';
import type { Report } from '../../../shared/types';
import { ReportStatusBadge } from '../../reports/components/ReportStatusBadge';

interface MapReportPreviewCardProps {
  report: Report;
}

const DEFAULT_NEIGHBORHOOD_TEXT = 'Barrio no especificado';
const DEFAULT_ADDRESS_TEXT = 'Sin dirección';

export function MapReportPreviewCard({ report }: MapReportPreviewCardProps) {
  const router = useRouter();

  const neighborhoodDisplay = report.neighborhood || DEFAULT_NEIGHBORHOOD_TEXT;
  const addressDisplay = report.address || DEFAULT_ADDRESS_TEXT;

  function handleNavigateToDetail() {
    router.push({
      pathname: '/report/[id]',
      params: { id: report.id },
    });
  }

  return (
    <TouchableOpacity
      style={styles.previewCard}
      activeOpacity={0.9}
      onPress={handleNavigateToDetail}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {report.title}
          </Text>
          <Text style={styles.cardAddress} numberOfLines={1}>
            📍 {neighborhoodDisplay}, {addressDisplay}
          </Text>
        </View>
        <ReportStatusBadge status={report.status} />
      </View>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {report.description}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardFooterText}>Toca para ver detalle completo</Text>
        <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  previewCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    ...Shadows.md,
    marginTop: Spacing.xs,
    gap: Spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  cardHeaderContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSize.sm + 1,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  cardAddress: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardDescription: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  cardFooterText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: FontWeight.bold,
  },
});

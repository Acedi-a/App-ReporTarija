// ============================================================
// TrackingTimeline - Línea de tiempo de seguimiento
// Muestra el historial de cambios de estado de un reporte
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TrackingEntry } from '../../../shared/types';
import { getStatusConfig } from '../../../shared/constants/reportStatus';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius } from '../../../shared/constants/theme';
import { formatDate } from '../../../shared/utils/date';

interface TrackingTimelineProps {
  entries: TrackingEntry[];
}

export function TrackingTimeline({ entries }: TrackingTimelineProps) {
  if (!entries || entries.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="git-commit-outline" size={24} color={Colors.textMuted} />
        <Text style={styles.emptyText}>No hay historial de seguimiento registrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {entries.map((entry, index) => {
        const config = getStatusConfig(entry.new_status);
        const isLast = index === entries.length - 1;

        return (
          <View key={entry.id || index} style={styles.item}>
            {/* Línea e Indicador */}
            <View style={styles.indicatorContainer}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: config.color, borderColor: config.backgroundColor },
                ]}
              >
                <Ionicons
                  name={config.ionicon as any}
                  size={10}
                  color={Colors.textInverse}
                />
              </View>
              {!isLast && <View style={styles.line} />}
            </View>

            {/* Contenido */}
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={[styles.statusLabel, { color: config.color }]}>
                  {config.label}
                </Text>
                <Text style={styles.date}>{formatDate(entry.created_at)}</Text>
              </View>
              {entry.comment ? (
                <Text style={styles.comment}>{entry.comment}</Text>
              ) : (
                <Text style={styles.noComment}>El municipio actualizó el estado a {config.label.toLowerCase()}</Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingLeft: Spacing.xs,
  },
  item: {
    flexDirection: 'row',
    gap: Spacing.md,
    minHeight: 70,
  },
  indicatorContainer: {
    alignItems: 'center',
    width: 24,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    zIndex: 1,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  content: {
    flex: 1,
    paddingBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
  date: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  comment: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: 4,
  },
  noComment: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});

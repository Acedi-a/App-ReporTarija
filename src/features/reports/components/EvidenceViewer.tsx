// ============================================================
// EvidenceViewer - Visualizador de fotos de evidencia
// Muestra una lista de imágenes de evidencia o un estado vacío
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Evidence } from '../../../shared/types';
import { Colors, FontSize, FontWeight, Spacing, BorderRadius, Shadows } from '../../../shared/constants/theme';

interface EvidenceViewerProps {
  evidences: Evidence[];
}

export function EvidenceViewer({ evidences }: EvidenceViewerProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>Evidencia Adjuntada</Text>
      {evidences.length > 0 ? (
        <View style={styles.evidenceWrapper}>
          {evidences.map((ev) => (
            <View key={ev.id} style={styles.imageCard}>
              <Image source={{ uri: ev.file_url }} style={styles.evidenceImage} />
              <Text style={styles.imageFooter} numberOfLines={1}>
                {ev.file_name || 'evidencia.jpg'}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noEvidenceContainer}>
          <Ionicons name="image-outline" size={32} color={Colors.textMuted} />
          <Text style={styles.noEvidenceText}>El ciudadano no adjuntó evidencia fotográfica.</Text>
        </View>
      )}
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
  sectionLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  evidenceWrapper: {
    marginTop: Spacing.xs,
  },
  imageCard: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
    padding: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  evidenceImage: {
    width: '100%',
    height: 220,
    borderRadius: BorderRadius.sm - 2,
    resizeMode: 'cover',
  },
  imageFooter: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  noEvidenceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.sm,
  },
  noEvidenceText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

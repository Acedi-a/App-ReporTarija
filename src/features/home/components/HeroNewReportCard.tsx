
import { Ionicons } from '@expo/vector-icons';
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

interface HeroNewReportCardProps {
  onNewReport: () => void;
}

export function HeroNewReportCard({ onNewReport }: HeroNewReportCardProps) {
  return (
    <View style={styles.heroCard}>
      <View style={styles.heroTop}>
        <View style={styles.heroIconContainer}>
          <Ionicons name="megaphone" size={28} color={Colors.textInverse} />
        </View>
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>¿Ves un problema?</Text>
          <Text style={styles.heroDescription}>
            Reporta baches, alumbrado dañado, basura y más
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.heroButton}
        onPress={onNewReport}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={18} color={Colors.primary} />
        <Text style={styles.heroButtonText}>Nuevo reporte</Text>
      </TouchableOpacity>
    </View>
  );
}

const ICON_CONTAINER_SIZE = 52;

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  heroIconContainer: {
    width: ICON_CONTAINER_SIZE,
    height: ICON_CONTAINER_SIZE,
    borderRadius: ICON_CONTAINER_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: Colors.textInverse,
  },
  heroDescription: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
    lineHeight: 18,
  },
  heroButton: {
    backgroundColor: Colors.textInverse,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md - 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    ...Shadows.sm,
  },
  heroButtonText: {
    color: Colors.primary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
});

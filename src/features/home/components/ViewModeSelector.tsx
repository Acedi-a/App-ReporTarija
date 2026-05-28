// ============================================================
// ViewModeSelector - Control segmentado Lista/Mapa
// Refactorización: Extract Component desde HomeScreen (BS-H01)
// Antes: ~50 líneas de JSX inline en HomeScreen
// Ahora: Componente reutilizable con responsabilidad única
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  BorderRadius,
  Shadows,
} from '../../../shared/constants/theme';

export type ViewMode = 'list' | 'map';

interface ViewModeSelectorProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

/** Configuración de las opciones del selector */
const VIEW_MODE_OPTIONS: { mode: ViewMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { mode: 'list', icon: 'list', label: 'Lista' },
  { mode: 'map', icon: 'map', label: 'Mapa' },
];

export function ViewModeSelector({ viewMode, onViewModeChange }: ViewModeSelectorProps) {
  const isMapMode = viewMode === 'map';

  return (
    <View style={[styles.container, !isMapMode && styles.containerListMode]}>
      {isMapMode && <Text style={styles.sectionTitle}>Mapa de Reportes</Text>}
      <View style={styles.segmentedControl}>
        {VIEW_MODE_OPTIONS.map(({ mode, icon, label }) => {
          const isActive = viewMode === mode;
          return (
            <TouchableOpacity
              key={mode}
              style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
              onPress={() => onViewModeChange(mode)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={icon}
                size={16}
                color={isActive ? Colors.textInverse : Colors.textSecondary}
              />
              <Text style={[styles.segmentButtonText, isActive && styles.segmentButtonTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  containerListMode: {
    justifyContent: 'flex-end',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLight,
    padding: 2,
    borderRadius: BorderRadius.md,
  },
  segmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md - 2,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  segmentButtonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
  segmentButtonTextActive: {
    color: Colors.textInverse,
  },
});

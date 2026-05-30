
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Colors,
  FontWeight,
  Spacing,
} from '../../../shared/constants/theme';

interface QuickCategory {
  categoryId: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  backgroundColor: string;
}


const QUICK_CATEGORIES: QuickCategory[] = [
  {
    categoryId: '1',
    label: 'Baches',
    icon: 'warning-outline',
    iconColor: '#2563EB',
    backgroundColor: '#E6F4FE',
  },
  {
    categoryId: '2',
    label: 'Alumbrado',
    icon: 'bulb-outline',
    iconColor: '#D97706',
    backgroundColor: '#FFFBEB',
  },
  {
    categoryId: '3',
    label: 'Basura',
    icon: 'trash-outline',
    iconColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  {
    categoryId: '6',
    label: 'Obra pública',
    icon: 'construct-outline',
    iconColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
];

interface QuickCategoryRowProps {
  onCategoryPress: (categoryId: string) => void;
}

export function QuickCategoryRow({ onCategoryPress }: QuickCategoryRowProps) {
  return (
    <View style={styles.container}>
      {QUICK_CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.categoryId}
          style={styles.categoryBtn}
          onPress={() => onCategoryPress(category.categoryId)}
          activeOpacity={0.7}
        >
          <View style={[styles.categoryIconCircle, { backgroundColor: category.backgroundColor }]}>
            <Ionicons name={category.icon} size={24} color={category.iconColor} />
          </View>
          <Text style={styles.categoryBtnText}>{category.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const ICON_CIRCLE_SIZE = 52;
const ICON_CIRCLE_RADIUS = 18;
const LABEL_FONT_SIZE = 11;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryBtn: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  categoryIconCircle: {
    width: ICON_CIRCLE_SIZE,
    height: ICON_CIRCLE_SIZE,
    borderRadius: ICON_CIRCLE_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBtnText: {
    fontSize: LABEL_FONT_SIZE,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
  },
});

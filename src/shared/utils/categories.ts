
import { Ionicons } from '@expo/vector-icons';
import { getCategoryConfig } from '../constants/categories';

export function getCategoryIcon(categoryName?: string): keyof typeof Ionicons.glyphMap {
  return getCategoryConfig(categoryName).icon;
}

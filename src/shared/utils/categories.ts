// ============================================================
// Categories Utils - Utilidades de categorías para ReporTarija
// ============================================================

import { Ionicons } from '@expo/vector-icons';
import { getCategoryConfig } from '../constants/categories';

/** Obtener icono según el nombre de la categoría */
export function getCategoryIcon(categoryName?: string): keyof typeof Ionicons.glyphMap {
  return getCategoryConfig(categoryName).icon;
}

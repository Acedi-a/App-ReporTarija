
import { Ionicons } from '@expo/vector-icons';

export interface CategoryStyleConfig {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
}

export const CATEGORY_CONFIGS: Record<string, CategoryStyleConfig> = {
  BACHE: {
    label: 'Bache',
    icon: 'warning-outline',
    color: '#D97706', // Ámbar
    backgroundColor: '#FEF3C7',
  },
  ALUMBRADO_PUBLICO: {
    label: 'Alumbrado público',
    icon: 'bulb-outline',
    color: '#D97706', // Amarillo
    backgroundColor: '#FFFBEB',
  },
  BASURA_ACUMULADA: {
    label: 'Basura acumulada',
    icon: 'trash-outline',
    color: '#059669', // Verde
    backgroundColor: '#F0FDF4',
  },
  FUGA_DE_AGUA: {
    label: 'Fuga de agua',
    icon: 'water-outline',
    color: '#0EA5E9', // Celeste
    backgroundColor: '#E0F2FE',
  },
  SEMAFORO_DANADO: {
    label: 'Semáforo dañado',
    icon: 'alert-circle-outline',
    color: '#EF4444', // Rojo
    backgroundColor: '#FEF2F2',
  },
  OTROS: {
    label: 'Otros',
    icon: 'ellipsis-horizontal-outline',
    color: '#4F46E5', // Indigo
    backgroundColor: '#EEF2FF',
  },
};

export const DEFAULT_CATEGORY_CONFIG: CategoryStyleConfig = {
  label: 'Otros',
  icon: 'alert-circle-outline',
  color: '#4F46E5',
  backgroundColor: '#EEF2FF',
};


export function getCategoryConfig(codeOrName?: string): CategoryStyleConfig {
  if (!codeOrName) return DEFAULT_CATEGORY_CONFIG;

  const normalized = codeOrName.toUpperCase().replace(/\s+/g, '_');
  if (CATEGORY_CONFIGS[normalized]) {
    return CATEGORY_CONFIGS[normalized];
  }

  const name = codeOrName.toLowerCase();
  if (name.includes('bache')) return CATEGORY_CONFIGS.BACHE;
  if (name.includes('alumbrado') || name.includes('luminaria')) return CATEGORY_CONFIGS.ALUMBRADO_PUBLICO;
  if (name.includes('basura')) return CATEGORY_CONFIGS.BASURA_ACUMULADA;
  if (name.includes('agua') || name.includes('fuga')) return CATEGORY_CONFIGS.FUGA_DE_AGUA;
  if (name.includes('semáforo') || name.includes('semaforo')) return CATEGORY_CONFIGS.SEMAFORO_DANADO;

  return DEFAULT_CATEGORY_CONFIG;
}

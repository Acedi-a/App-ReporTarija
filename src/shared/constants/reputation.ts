import type { Ionicons } from '@expo/vector-icons';
import { Colors } from './theme';

export interface ReputationRank {
  minPoints: number;
  name: string;
  color: string;
  icon: keyof typeof Ionicons.glyphMap;
}


export const REPUTATION_RANKS: ReputationRank[] = [
  {
    minPoints: 300,
    name: 'Héroe Urbano',
    color: '#10B981', // Emerald
    icon: 'trophy-outline',
  },
  {
    minPoints: 150,
    name: 'Guardián de Tarija',
    color: '#8B5CF6', // Purple
    icon: 'shield-half-outline',
  },
  {
    minPoints: 50,
    name: 'Vecino Activo',
    color: '#3B82F6', // Blue
    icon: 'checkmark-circle-outline',
  },
  {
    minPoints: 0,
    name: 'Vecino Observador',
    color: Colors.primary,
    icon: 'eye-outline',
  },
];


export function getUserRank(points: number): ReputationRank {
  return REPUTATION_RANKS.find((rank) => points >= rank.minPoints) || REPUTATION_RANKS[REPUTATION_RANKS.length - 1];
}

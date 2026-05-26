// ============================================================
// Configuración de estados de reporte
// Colores, labels e iconos para cada estado
// ============================================================

import type { ReportStatus } from '../types';

export interface StatusConfig {
  label: string;
  color: string;
  backgroundColor: string;
  icon: string;
  ionicon: string;
}

export const REPORT_STATUS_CONFIG: Record<ReportStatus, StatusConfig> = {
  PENDIENTE: {
    label: 'Pendiente',
    color: '#D97706',
    backgroundColor: '#FEF3C7',
    icon: 'clock',
    ionicon: 'time-outline',
  },
  EN_REVISION: {
    label: 'En revisión',
    color: '#2563EB',
    backgroundColor: '#DBEAFE',
    icon: 'search',
    ionicon: 'search-outline',
  },
  ASIGNADO: {
    label: 'Asignado',
    color: '#7C3AED',
    backgroundColor: '#EDE9FE',
    icon: 'user-check',
    ionicon: 'person-add-outline',
  },
  EN_PROCESO: {
    label: 'En proceso',
    color: '#0891B2',
    backgroundColor: '#CFFAFE',
    icon: 'tool',
    ionicon: 'construct-outline',
  },
  RESUELTO: {
    label: 'Resuelto',
    color: '#16A34A',
    backgroundColor: '#DCFCE7',
    icon: 'check-circle',
    ionicon: 'checkmark-circle-outline',
  },
  RECHAZADO: {
    label: 'Rechazado',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    icon: 'x-circle',
    ionicon: 'close-circle-outline',
  },
};

/** Obtener la configuración de un estado */
export function getStatusConfig(status: ReportStatus): StatusConfig {
  return REPORT_STATUS_CONFIG[status];
}

/** Obtener el label legible de un estado */
export function getStatusLabel(status: ReportStatus): string {
  return REPORT_STATUS_CONFIG[status].label;
}

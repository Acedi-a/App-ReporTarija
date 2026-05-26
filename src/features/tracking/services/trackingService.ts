// ============================================================
// Tracking Service - Historial de seguimiento de reportes
// Conectado a la base de datos de InsForge
// ============================================================

import { insforge } from '../../../lib/insforge';
import type { TrackingEntry } from '../../../shared/types';

/**
 * Obtiene la secuencia de estados de un reporte (línea de tiempo).
 */
export async function getTrackingByReportId(reportId: string): Promise<TrackingEntry[]> {
  const { data, error } = await insforge.database
    .from('tracking')
    .select('*')
    .eq('report_id', reportId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error('Error al obtener el historial del reporte');
  }

  return (data as TrackingEntry[]) || [];
}

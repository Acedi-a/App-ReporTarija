import { insforge } from '../../../lib/insforge';
import type { TrackingEntry } from '../../../shared/types';

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

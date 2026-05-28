import { getEvidencesByReportId } from '@/src/features/evidence/services/evidenceService';
import { getReportById } from '@/src/features/reports/services/reportService';
import { getTrackingByReportId } from '@/src/features/tracking/services/trackingService';
import type { Evidence, Report, TrackingEntry } from '@/src/shared/types';
import { useCallback, useEffect, useState } from 'react';

export function useReportDetail(id?: string) {
  const [report, setReport] = useState<Report | null>(null);
  const [tracking, setTracking] = useState<TrackingEntry[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (isSilent = false) => {
    if (!id) return;
    if (!isSilent) setLoading(true);
    setError(null);

    try {
      const [reportData, trackingData, evidenceData] = await Promise.all([
        getReportById(id),
        getTrackingByReportId(id),
        getEvidencesByReportId(id),
      ]);

      setReport(reportData);
      setTracking(trackingData);
      setEvidences(evidenceData);
    } catch (err: any) {
      console.error('Error al cargar detalle de reporte:', err);
      setError('No se pudieron obtener los datos de este reporte.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  return {
    report,
    tracking,
    evidences,
    loading,
    refreshing,
    error,
    handleRefresh,
  };
}

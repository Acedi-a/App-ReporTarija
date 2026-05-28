// ============================================================
// useHomeData - Custom Hook de negocio para la pantalla principal
// Encapsula fetching y cálculo de estadísticas
// ============================================================
// Refactorizaciones aplicadas:
//   - Dispensable: Eliminada variable totalReports (DI-H01)
//     Se declaraba, calculaba y retornaba pero nunca se usaba
//     en HomeScreen. Código muerto eliminado.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import * as reportService from '../../../features/reports/services/reportService';
import type { Report, ReportStatus } from '../../../shared/types';

const INITIAL_STATS: Record<ReportStatus, number> = {
  PENDIENTE: 0,
  EN_REVISION: 0,
  ASIGNADO: 0,
  EN_PROCESO: 0,
  RESUELTO: 0,
  RECHAZADO: 0,
};

/** Cantidad de reportes recientes a mostrar en Home */
const RECENT_REPORTS_LIMIT = 5;

export function useHomeData(userId: string | undefined) {
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Record<ReportStatus, number>>(INITIAL_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!userId) return;

    try {
      const [reportsData, statsData] = await Promise.all([
        reportService.getRecentReports(userId, RECENT_REPORTS_LIMIT),
        reportService.getReportStats(userId),
      ]);

      setRecentReports(reportsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error al cargar datos del home:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  return {
    recentReports,
    stats,
    isLoading,
    isRefreshing,
    refresh,
  };
}

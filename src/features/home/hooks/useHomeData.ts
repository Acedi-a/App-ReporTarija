// ============================================================
// useHomeData - Custom Hook de negocio para la pantalla principal
// Encapsula fetching y cálculo de estadísticas
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import * as reportService from '../../../features/reports/services/reportService';
import type { Report, ReportStatus } from '../../../shared/types';

export function useHomeData(userId: string | undefined) {
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Record<ReportStatus, number>>({
    PENDIENTE: 0,
    EN_REVISION: 0,
    ASIGNADO: 0,
    EN_PROCESO: 0,
    RESUELTO: 0,
    RECHAZADO: 0,
  });
  const [totalReports, setTotalReports] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!userId) return;

    try {
      const [reportsData, statsData] = await Promise.all([
        reportService.getRecentReports(userId, 5),
        reportService.getReportStats(userId),
      ]);

      setRecentReports(reportsData);
      setStats(statsData);

      // Calcular total
      const total = Object.values(statsData).reduce((sum, count) => sum + count, 0);
      setTotalReports(total);
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
    totalReports,
    isLoading,
    isRefreshing,
    refresh,
  };
}

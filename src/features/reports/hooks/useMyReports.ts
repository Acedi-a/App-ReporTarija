import { getMyReports } from '@/src/features/reports/services/reportService';
import { useAuth } from '@/src/shared/hooks/useAuth';
import type { Report } from '@/src/shared/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type FilterTab = 'TODOS' | 'PENDIENTES' | 'PROCESO' | 'RESUELTOS' | 'RECHAZADOS';


const STATUS_FILTER_MAP: Record<Exclude<FilterTab, 'TODOS'>, Report['status'][]> = {
  PENDIENTES: ['PENDIENTE'],
  PROCESO: ['EN_REVISION', 'ASIGNADO', 'EN_PROCESO'],
  RESUELTOS: ['RESUELTO'],
  RECHAZADOS: ['RECHAZADO'],
};

export function useMyReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('TODOS');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = useCallback(async (isSilent = false) => {
    if (!user?.id) return;
    if (!isSilent) setLoading(true);

    try {
      const data = await getMyReports(user.id);
      setReports(data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadReports(true);
  }, [loadReports]);


  const filteredReports = useMemo(() => {
    if (activeTab === 'TODOS') {
      return reports;
    }
    const targetStatuses = STATUS_FILTER_MAP[activeTab];
    return reports.filter((report) => targetStatuses.includes(report.status));
  }, [reports, activeTab]);

  return {
    filteredReports,
    activeTab,
    setActiveTab,
    loading,
    refreshing,
    handleRefresh,
  };
}

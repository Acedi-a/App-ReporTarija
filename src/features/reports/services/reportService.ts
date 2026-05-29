import { insforge } from '../../../lib/insforge';
import type { Category, Report, ReportStatus } from '../../../shared/types';
import type { CreateReportDto } from '../dtos/create-report.dto';


export async function getMyReports(citizenId: string): Promise<Report[]> {
  const { data, error } = await insforge.database
    .from('reports')
    .select('*, categories(id, name, code)')
    .eq('citizen_id', citizenId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('Error al obtener tus reportes');
  }

  return (data as Report[]) || [];
}


export async function getRecentReports(citizenId: string, limit: number = 5): Promise<Report[]> {
  const { data, error } = await insforge.database
    .from('reports')
    .select('*, categories(id, name, code)')
    .eq('citizen_id', citizenId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error('Error al obtener reportes recientes');
  }

  return (data as Report[]) || [];
}


export async function getReportById(reportId: string): Promise<Report> {
  const { data, error } = await insforge.database
    .from('reports')
    .select('*, categories(id, name, code)')
    .eq('id', reportId)
    .single();

  if (error || !data) {
    throw new Error('Reporte no encontrado');
  }

  return data as Report;
}


export async function createReport(citizenId: string, reportData: CreateReportDto): Promise<Report> {
  const newReport = {
    ...reportData,
    citizen_id: citizenId,
    status: 'PENDIENTE' as ReportStatus,
    priority: 'MEDIA',
  };

  const { data, error } = await insforge.database
    .from('reports')
    .insert(newReport)
    .select('*, categories(id, name, code)');

  if (error) {
    throw new Error('Error al crear el reporte');
  }

  if (!data || data.length === 0) {
    throw new Error('No se pudo crear el reporte');
  }

  return data[0] as Report;
}

export async function getReportStats(citizenId: string): Promise<Record<ReportStatus, number>> {
  const { data, error } = await insforge.database
    .from('reports')
    .select('status')
    .eq('citizen_id', citizenId);

  if (error) {
    throw new Error('Error al obtener estadísticas');
  }

  const stats: Record<ReportStatus, number> = {
    PENDIENTE: 0,
    EN_REVISION: 0,
    ASIGNADO: 0,
    EN_PROCESO: 0,
    RESUELTO: 0,
    RECHAZADO: 0,
  };

  if (data) {
    for (const report of data as { status: ReportStatus }[]) {
      stats[report.status] = (stats[report.status] || 0) + 1;
    }
  }

  return stats;
}


export async function getCategories(): Promise<Category[]> {
  const { data, error } = await insforge.database
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) {
    throw new Error('Error al obtener categorías');
  }

  return (data as Category[]) || [];
}

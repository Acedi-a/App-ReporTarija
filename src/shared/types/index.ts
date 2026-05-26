// ============================================================
// Tipos globales de la aplicación ReporTarija
// ============================================================

/** Roles del sistema */
export type UserRole = 'CITIZEN' | 'ADMIN' | 'FUNCIONARIO' | 'TECNICO' | 'RESPONSABLE_AREA';

/** Estados posibles de un reporte */
export type ReportStatus =
  | 'PENDIENTE'
  | 'EN_REVISION'
  | 'ASIGNADO'
  | 'EN_PROCESO'
  | 'RESUELTO'
  | 'RECHAZADO';

/** Prioridades de reporte */
export type ReportPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

/** Tipos de notificación */
export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';

/** Códigos de categoría */
export type CategoryCode =
  | 'BACHE'
  | 'ALUMBRADO_PUBLICO'
  | 'BASURA_ACUMULADA'
  | 'FUGA_DE_AGUA'
  | 'SEMAFORO_DANADO'
  | 'OTROS';

// ============================================================
// Entidades de la base de datos
// ============================================================

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  area_id: number | null;
  is_active: boolean;
  reputation_points: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  code: CategoryCode;
  description: string | null;
  default_area_id: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  category_id: number;
  citizen_id: string;
  assigned_to: string | null;
  assigned_area_id: number | null;
  status: ReportStatus;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  neighborhood: string | null;
  priority: ReportPriority;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  /** Relación con categoría (join) */
  categories?: Category;
}

export interface Evidence {
  id: number;
  report_id: string;
  file_url: string;
  file_name: string | null;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export interface TrackingEntry {
  id: number;
  report_id: string;
  previous_status: ReportStatus | null;
  new_status: ReportStatus;
  comment: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: string;
  report_id: string | null;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

// ============================================================
// Datos para crear reportes
// ============================================================

export interface CreateReportData {
  title: string;
  description: string;
  category_id: number;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  neighborhood?: string | null;
}

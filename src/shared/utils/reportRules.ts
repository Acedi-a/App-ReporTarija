const CANCELLABLE_STATUSES = ['PENDIENTE', 'EN_REVISION'] as const;

export function canCancelReport(status: string): boolean {
  return (CANCELLABLE_STATUSES as readonly string[]).includes(status);
}

const PRIORITY_LABELS: Record<string, string> = {
  BAJA: '🟢 Baja',
  MEDIA: '🟡 Media',
  ALTA: '🟠 Alta',
  URGENTE: '🔴 Urgente',
};

const DEFAULT_PRIORITY_LABEL = 'Desconocida';

export function getReportPriorityLabel(priority: string): string {
  return PRIORITY_LABELS[priority] || DEFAULT_PRIORITY_LABEL;
}

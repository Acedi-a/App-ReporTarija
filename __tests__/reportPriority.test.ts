import { getReportPriorityLabel } from '@/src/shared/utils/reportRules';

describe('getReportPriorityLabel', () => {
  it('debe retornar "🟢 Baja" para prioridad BAJA', () => {
    expect(getReportPriorityLabel('BAJA')).toBe('🟢 Baja');
  });

  it('debe retornar "🟡 Media" para prioridad MEDIA', () => {
    expect(getReportPriorityLabel('MEDIA')).toBe('🟡 Media');
  });

  it('debe retornar "🟠 Alta" para prioridad ALTA', () => {
    expect(getReportPriorityLabel('ALTA')).toBe('🟠 Alta');
  });

  it('debe retornar "🔴 Urgente" para prioridad URGENTE', () => {
    expect(getReportPriorityLabel('URGENTE')).toBe('🔴 Urgente');
  });

  it('debe retornar "Desconocida" para prioridad no válida', () => {
    expect(getReportPriorityLabel('INEXISTENTE')).toBe('Desconocida');
  });
});

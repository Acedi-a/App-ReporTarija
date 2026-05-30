import { canCancelReport } from '@/src/shared/utils/reportRules';

describe('canCancelReport', () => {
  it('debe permitir cancelar un reporte en estado PENDIENTE', () => {
    expect(canCancelReport('PENDIENTE')).toBe(true);
  });

  it('debe permitir cancelar un reporte en estado EN_REVISION', () => {
    expect(canCancelReport('EN_REVISION')).toBe(true);
  });

  it('debe rechazar cancelar un reporte ASIGNADO', () => {
    expect(canCancelReport('ASIGNADO')).toBe(false);
  });

  it('debe rechazar cancelar un reporte EN_PROCESO', () => {
    expect(canCancelReport('EN_PROCESO')).toBe(false);
  });

  it('debe rechazar cancelar un reporte RESUELTO', () => {
    expect(canCancelReport('RESUELTO')).toBe(false);
  });

  it('debe rechazar cancelar un reporte RECHAZADO', () => {
    expect(canCancelReport('RECHAZADO')).toBe(false);
  });

  it('debe rechazar un estado desconocido', () => {
    expect(canCancelReport('INVENTADO')).toBe(false);
  });
});

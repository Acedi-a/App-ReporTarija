import { isValidReportTitle } from '@/src/shared/utils/validators';

describe('isValidReportTitle', () => {
  it('debe rechazar un título vacío', () => {
    expect(isValidReportTitle('')).toBe(false);
  });

  it('debe rechazar un título con solo espacios', () => {
    expect(isValidReportTitle('   ')).toBe(false);
  });

  it('debe rechazar un título menor a 5 caracteres', () => {
    expect(isValidReportTitle('Hola')).toBe(false);
  });

  it('debe rechazar un título mayor a 100 caracteres', () => {
    const tituloLargo = 'A'.repeat(101);
    expect(isValidReportTitle(tituloLargo)).toBe(false);
  });

  it('debe aceptar un título válido', () => {
    expect(isValidReportTitle('Bache en Av. Las Américas')).toBe(true);
  });

  it('debe aceptar un título con exactamente 5 caracteres', () => {
    expect(isValidReportTitle('Bache')).toBe(true);
  });

  it('debe aceptar un título con exactamente 100 caracteres', () => {
    const titulo100 = 'A'.repeat(100);
    expect(isValidReportTitle(titulo100)).toBe(true);
  });
});

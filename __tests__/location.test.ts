import { formatCoordinates } from '@/src/shared/utils/location';

describe('formatCoordinates', () => {
  it('debe formatear coordenadas válidas a texto legible', () => {
    expect(formatCoordinates(-21.5355, -64.7296)).toBe('-21.5355, -64.7296');
  });

  it('debe retornar "Ubicación no disponible" si latitud es null', () => {
    expect(formatCoordinates(null, -64.7296)).toBe('Ubicación no disponible');
  });

  it('debe retornar "Ubicación no disponible" si longitud es null', () => {
    expect(formatCoordinates(-21.5355, null)).toBe('Ubicación no disponible');
  });

  it('debe retornar "Ubicación no disponible" si ambas son null', () => {
    expect(formatCoordinates(null, null)).toBe('Ubicación no disponible');
  });

  it('debe limitar a 6 decimales como máximo', () => {
    expect(formatCoordinates(-21.535512345, -64.729612345)).toBe('-21.535512, -64.729612');
  });

  it('debe manejar coordenadas con valor cero', () => {
    expect(formatCoordinates(0, 0)).toBe('0, 0');
  });
});

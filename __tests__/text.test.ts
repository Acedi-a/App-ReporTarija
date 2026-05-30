import { truncateText } from '@/src/shared/utils/text';

describe('truncateText', () => {
  it('debe retornar el texto tal cual si es más corto que el límite', () => {
    expect(truncateText('Hola mundo', 20)).toBe('Hola mundo');
  });

  it('debe truncar y agregar "..." si excede el límite', () => {
    expect(truncateText('Bache muy grande en la avenida principal de Tarija', 20)).toBe('Bache muy grande en ...');
  });

  it('debe manejar un texto vacío', () => {
    expect(truncateText('', 10)).toBe('');
  });

  it('debe retornar el texto exacto si tiene la misma longitud que el límite', () => {
    expect(truncateText('12345', 5)).toBe('12345');
  });

  it('debe truncar correctamente con límite de 1', () => {
    expect(truncateText('Hola', 1)).toBe('H...');
  });

  it('debe manejar textos con espacios al final antes de truncar', () => {
    expect(truncateText('Hola   mundo cruel y despiadado', 10)).toBe('Hola   mun...');
  });
});

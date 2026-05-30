# 🧪 TDD — Desarrollo Guiado por Pruebas — ReporTarija

Documentación de los 5 ciclos TDD (Red-Green-Refactor) aplicados en la **App Móvil Ciudadana ReporTarija** para la materia de **Ingeniería de Software 2**.

---

## Configuración

- **Framework de testing:** Jest 29 + ts-jest
- **Comando:** `pnpm test`
- **Carpeta de tests:** `__tests__/`

---

## TDD #1 — `isValidReportTitle()`

**Archivo test:** `__tests__/validators.test.ts`
**Archivo implementación:** `src/shared/utils/validators.ts`

| Fase | Qué se hizo |
|------|-------------|
| 🔴 Red | Se escribieron 7 tests: título vacío, solo espacios, menor a 5 chars, mayor a 100 chars, válido, límite inferior (5), límite superior (100). Falló porque `validators.ts` no existía. |
| 🟢 Green | Se creó la función con `trim()` y validación de rango `MIN`/`MAX`. Los 7 tests pasaron. |
| 🔵 Refactor | Se exportaron las constantes `REPORT_TITLE_MIN_LENGTH` y `REPORT_TITLE_MAX_LENGTH` para reutilización. Se separó la validación de vacío explícitamente. Tests siguen pasando. |

---

## TDD #2 — `formatCoordinates()`

**Archivo test:** `__tests__/location.test.ts`
**Archivo implementación:** `src/shared/utils/location.ts`

| Fase | Qué se hizo |
|------|-------------|
| 🔴 Red | Se escribieron 6 tests: coordenadas válidas, latitud null, longitud null, ambas null, limitar a 6 decimales, coordenadas en cero. Falló porque `location.ts` no existía. |
| 🟢 Green | Se creó la función con validación de null y `toFixed(6)`. Los 6 tests pasaron. |
| 🔵 Refactor | Se extrajo la constante `COORDINATE_PRECISION`, la constante `NO_LOCATION_MESSAGE` y la función auxiliar `hasValidCoordinates()`. Tests siguen pasando. |

---

## TDD #3 — `canCancelReport()`

**Archivo test:** `__tests__/reportRules.test.ts`
**Archivo implementación:** `src/shared/utils/reportRules.ts`

| Fase | Qué se hizo |
|------|-------------|
| 🔴 Red | Se escribieron 7 tests: PENDIENTE (true), EN_REVISION (true), ASIGNADO (false), EN_PROCESO (false), RESUELTO (false), RECHAZADO (false), estado desconocido (false). Falló porque `reportRules.ts` no existía. |
| 🟢 Green | Se creó la función con comparación directa `===`. Los 7 tests pasaron. |
| 🔵 Refactor | Se extrajo la constante `CANCELLABLE_STATUSES` como array readonly y se usó `.includes()` en vez de comparaciones encadenadas. Tests siguen pasando. |

---

## TDD #4 — `truncateText()`

**Archivo test:** `__tests__/text.test.ts`
**Archivo implementación:** `src/shared/utils/text.ts`

| Fase | Qué se hizo |
|------|-------------|
| 🔴 Red | Se escribieron 6 tests: texto corto (sin truncar), texto largo (truncar con "..."), vacío, longitud exacta, límite de 1, texto con espacios. Falló porque `text.ts` no existía. |
| 🟢 Green | Se creó la función con `slice()` y concatenación de `"..."`. Los 6 tests pasaron. |
| 🔵 Refactor | Se extrajo la constante `ELLIPSIS` y se usó template literal en vez de concatenación. Tests siguen pasando. |

---

## TDD #5 — `getReportPriorityLabel()`

**Archivo test:** `__tests__/reportPriority.test.ts`
**Archivo implementación:** `src/shared/utils/reportRules.ts`

| Fase | Qué se hizo |
|------|-------------|
| 🔴 Red | Se escribieron 5 tests: BAJA → "🟢 Baja", MEDIA → "🟡 Media", ALTA → "🟠 Alta", URGENTE → "🔴 Urgente", desconocida → "Desconocida". Falló porque la función no existía en `reportRules.ts`. |
| 🟢 Green | Se creó la función con cadena de `if/else`. Los 5 tests pasaron. |
| 🔵 Refactor | Se reemplazó la cadena de `if/else` por una tabla de decisiones (`Record<string, string>`) con constante `PRIORITY_LABELS` y `DEFAULT_PRIORITY_LABEL`. Tests siguen pasando. |

---

## Resultado Final

```
 PASS __tests__/validators.test.ts
 PASS __tests__/location.test.ts
 PASS __tests__/reportRules.test.ts
 PASS __tests__/text.test.ts
 PASS __tests__/reportPriority.test.ts

Test Suites: 5 passed, 5 total
Tests:       31 passed, 31 total
```

## Archivos creados con TDD

| Archivo | Funciones |
|---------|-----------|
| `src/shared/utils/validators.ts` | `isValidReportTitle()` |
| `src/shared/utils/location.ts` | `formatCoordinates()` |
| `src/shared/utils/reportRules.ts` | `canCancelReport()`, `getReportPriorityLabel()` |
| `src/shared/utils/text.ts` | `truncateText()` |

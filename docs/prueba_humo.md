# 💨 Prueba de Humo (Smoke Test) — ReporTarija

Documentación de la **Prueba de Humo (Clasificación por Objetivo)** aplicada en la **App Móvil Ciudadana ReporTarija** para la materia de **Ingeniería de Software 2**.

---

## Ficha Técnica de la Prueba

- **Clasificación:** Prueba por Objetivo (Estabilidad Inicial / Smoke Test).
- **Archivo de Prueba:** `__tests__/smoke.test.ts`
- **Herramienta:** Jest 29 + ts-jest (entorno de pruebas aislado en Node).
- **Componentes Testeados:** 
  1. `InsforgeClient` (`src/lib/insforge.ts`): Cliente BaaS.
  2. `authService` (`src/features/auth/services/authService.ts`): Servicio de sesión.

---

## Propósito y Justificación de la Prueba

El objetivo de una **Prueba de Humo** es validar que las funciones core y los puntos de entrada más críticos de la aplicación puedan inicializarse y responder a llamadas iniciales sin provocar fallos catastróficos o craseos inesperados del sistema. 

Se realiza sobre el módulo de **Conexión al Backend e Inicio de Sesión** por ser el más sensible durante el arranque de la app.

---

## Estructura de los Casos de Prueba

La prueba implementa dos verificaciones clave:

### 1. Validación de Inicialización del Cliente (Singleton)
Verifica que el constructor del cliente sea inaccesible directamente y que la inicialización a través del método estático `getInstance()` devuelva la misma instancia exacta en memoria para múltiples llamadas concurrentes.

```typescript
const instance1 = InsforgeClient.getInstance();
const instance2 = InsforgeClient.getInstance();
expect(instance1).toBe(instance2);
```

### 2. Validación de Resiliencia del Servicio de Autenticación
Comprueba el flujo feliz de inicio en modo demostración (`loginDemo()`). La prueba valida que, en ausencia de variables de entorno de producción o de conectividad a internet activa, el servicio sea capaz de responder de forma segura devolviendo la información del usuario demo (`DEMO_USER`) en lugar de arrojar una excepción no controlada que detenga la aplicación.

```typescript
const user = await authService.loginDemo();
expect(user.email).toBe('ciudadana@reportatarija.bo');
```

---

## Resultados de Ejecución

Al ejecutar la suite de pruebas mediante la consola:

```bash
pnpm test -- smoke.test
```

Se obtiene un resultado satisfactorio que confirma la estabilidad de arranque:

```text
 PASS  __tests__/smoke.test.ts
  Prueba de Humo (Smoke Test) - Core del Sistema
    ✓ debe inicializar el Singleton de InsforgeClient correctamente (1 ms)
    ✓ debe responder al flujo de login demo sin crasear (4 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.341 s
```

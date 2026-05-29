# 📐 Patrones de Diseño Implementados — ReporTarija

Este documento contiene un resumen breve y académico de los patrones de diseño aplicados en el código de la **App Móvil Ciudadana ReporTarija** para la materia de **Ingeniería de Software 2**.

---

## 1. Patrón Singleton (Creacional)
* **Propósito:** Garantizar que exista una única instancia de conexión con el Backend as a Service (BaaS) compartida en toda la aplicación, aplicando *Lazy Initialization* (inicialización perezosa).
* **Archivos clave:**
  * [`src/lib/insforge.ts`](../src/lib/insforge.ts) (Clase `InsforgeClient` con constructor privado y método estático `getInstance()`).

---

## 2. Patrón Repository (Creacional / Datos)
* **Propósito:** Centralizar y encapsular la lógica de acceso a datos (consultas del SDK, inserciones, etc.) aislando a los componentes de la interfaz de usuario del origen físico de la base de datos.
* **Archivos clave:**
  * [`src/features/reports/services/reportService.ts`](../src/features/reports/services/reportService.ts) (CRUD de reportes).
  * [`src/features/auth/services/authService.ts`](../src/features/auth/services/authService.ts) (Autenticación y registro).
  * [`src/features/notifications/services/notificationService.ts`](../src/features/notifications/services/notificationService.ts) (Alertas del sistema).

---

## 3. Patrón DTO — Data Transfer Object (Estructura de Datos)
* **Propósito:** Transportar conjuntos de datos a través de las capas de software, evitando el acoplamiento directo con los modelos de base de datos (`Report`, `User`) y eliminando el code smell de *Primitive Obsession* en las firmas de los métodos.
* **Archivos clave:**
  * [`src/features/reports/dtos/create-report.dto.ts`](../src/features/reports/dtos/create-report.dto.ts) (`CreateReportDto`).
  * [`src/features/auth/dtos/login.dto.ts`](../src/features/auth/dtos/login.dto.ts) (`LoginDto`).
  * [`src/features/auth/dtos/register.dto.ts`](../src/features/auth/dtos/register.dto.ts) (`RegisterDto`).

---

## 4. Patrón Strategy (Comportamiento)
* **Propósito:** Definir diferentes estrategias de renderizado para un componente complejo basándose en la plataforma de ejecución (Web vs. Móvil nativo) a través de un contrato de propiedades unificado.
* **Archivos clave:**
  * [`src/features/home/components/HomeMapTab.native.tsx`](../src/features/home/components/HomeMapTab.native.tsx) (Estrategia nativa con react-native-maps).
  * [`src/features/home/components/HomeMapTab.web.tsx`](../src/features/home/components/HomeMapTab.web.tsx) (Estrategia web con iframe de OpenStreetMap).

---

## 5. Patrón Facade / Fachada (Estructural)
* **Propósito:** Simplificar la interacción con subsistemas complejos (geolocalización, manipulación de cámara, validación del formulario con React Hook Form, etc.) exponiendo una interfaz unificada y reactiva a los componentes de vista.
* **Archivos clave:**
  * [`src/features/reports/hooks/useCreateReportForm.ts`](../src/features/reports/hooks/useCreateReportForm.ts) (Fachada del flujo de creación de reportes).
  * Capa de Servicios en `src/features/*/services` (Fachada del SDK BaaS).

---

## 6. Patrón State / Tabla de Decisiones (Comportamiento)
* **Propósito:** Mapear comportamientos y apariencias visuales según el estado de una entidad, evitando bloques condicionales anidados (`if-else` o `switch-case`) distribuidos en los archivos JSX de la UI.
* **Archivos clave:**
  * [`src/shared/constants/reportStatus.ts`](../src/shared/constants/reportStatus.ts) (Configuración visual del ciclo de estados del reporte).
  * [`src/shared/constants/reputation.ts`](../src/shared/constants/reputation.ts) (Rangos de reputación del ciudadano).

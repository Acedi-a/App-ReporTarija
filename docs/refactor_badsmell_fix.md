# 🛠️ Reporte de Refactorización y Corrección de Bad Smells — ReporTarija

Este documento resume las tareas de auditoría y refactorización aplicadas sobre la **App Móvil Ciudadana ReporTarija** para la materia de Ingeniería de Software 2. Se han identificado y eliminado múltiples malas prácticas de código (*Bad Smells*) siguiendo los principios de Clean Code y refactorización arquitectónica.

---

## 📊 Resumen General de Métricas


| Feature / Pantalla | Archivo Original | Líneas Antes | Líneas Después | Reducción (%) | Principales Técnicas Aplicadas |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Home** | `app/(tabs)/index.tsx` | 369 | 110 | **70.2%** | *Extract Component, Replace Magic Number, Decompose Conditional* |
| **Crear Reporte** | `app/(tabs)/create.tsx` | 306 | 98 | **67.9%** | *Extract Hook, Extract Component, Decompose Conditional* |
| **Mis Reportes** | `app/(tabs)/reports.tsx` | 250 | 118 | **52.8%** | *Extract Hook, Table-driven logic (Replace Conditional)* |
| **Detalle de Reporte** | `app/report/[id].tsx` | 234 | 148 | **36.7%** | *Extract Hook, Replace Magic Number* |
| **Notificaciones** | `app/(tabs)/notifications.tsx` | 281 | 110 | **60.8%** | *Extract Hook, Extract Component, Replace Conditional* |
| **Perfil** | `app/(tabs)/profile.tsx` | 207 | 129 | **37.7%** | *Table-driven logic, Replace Magic Number* |

---

## Detalle de Bad Smells Identificados y Soluciones por Feature

### 1. Feature: Home (Dashboard de Bienvenida)

| Código Smell | Tipo de Smell | Ubicación Original | Descripción | Solución Aplicada |
| :--- | :--- | :--- | :--- | :--- |
| **BS-H01** | 🔴 Bloater (Large Class) | `index.tsx` | La pantalla contenía inline el mapa web, mapa nativo, tarjetas de presentación y la selección de modo en un solo bloque JSX. | **Extract Component**: Se extrajeron `QuickCategoryRow`, `HeroNewReportCard` y `ViewModeSelector`. |
| **BS-H02** | 🔵 Change Preventer / Coupler | `index.tsx`, `HomeMapTab.*` | Colores primarios (`#0D9488`) y constantes de coordenadas duplicadas y hardcodeadas. | **Replace Magic Number**: Se unificó el color primario con `Colors.primary` y se extrajeron las coordenadas demo de Tarija a constantes. |
| **BS-H03** | 🟠 OO Abuser | `HomeMapTab.native.tsx` | Un condicional largo `if/else` decidía de forma imperativa los colores de los pines del mapa según el estado. | **Decompose Conditional**: Se utilizó la función utilitaria central `getStatusConfig(status)` para mapear colores reactivos de forma declarativa. |
| **BS-H04** | ⚪ Dispensable | `useHomeData.ts` | Existía el estado `totalReports` declarado y actualizado con llamadas a BD que nunca se renderizaba. | **Dead Code Removal**: Se eliminó por completo el estado inútil. |

---

### 2. Feature: Create Report (Crear Reporte)

| Código Smell | Tipo de Smell | Ubicación Original | Descripción | Solución Aplicada |
| :--- | :--- | :--- | :--- | :--- |
| **BS-C01** | 🔴 Bloater (Long Method) | `create.tsx` | El método `onSubmit` (50+ líneas) gestionaba validación de sesión, inserción del reporte, subida de foto a storage, manejo de errores parciales y navegación. | **Extract Method**: Se extrajeron las responsabilidades a `tryUploadEvidence` y `resetFormAndNavigate`. Posteriormente, se delegó todo al hook `useCreateReportForm`. |
| **BS-C02** | 🔴 Bloater (Large Class) | `create.tsx` | Toda la lógica del formulario y hooks de Expo React Native vivían dentro del componente de layout. | **Extract Hook**: Se creó el custom hook `useCreateReportForm.ts` aislando los estados de React y hooks de navegación. |
| **BS-C03** | 🔴 Bloater (Bloated JSX) | `create.tsx` | El renderizado del text input de descripción e indicadores de caracteres mínimos ocupaba más de 40 líneas de código JSX. | **Extract Component**: Se extrajo a un componente dedicado `DescriptionInput.tsx`. |
| **BS-C04** | 🔴 Bloater (Duplicate Code) | `EvidenceUploader.tsx` | `handleTakePhoto` y `handlePickImage` eran 90% idénticos, cambiando únicamente la función interna de llamada del picker de Expo. | **Extract Method**: Se unificaron en la función parametrizada `pickImageFromSource(source)`. |
| **BS-C05** | 🟠 OO Abuser | `LocationPicker.tsx` | Múltiples operadores ternarios anidados determinaban el texto del botón GPS según la carga y permisos del dispositivo. | **Decompose Conditional**: Se extrajo a la función pura `getGpsButtonText(loading, status)`. |
| **BS-C06** | 🔵 Change Preventer | `create.tsx`, `validations.ts` | El valor mínimo de caracteres del título (`5`) estaba hardcodeado tanto en la interfaz como en el validador Zod. | **Replace Magic Number**: Se centralizó la regla en la constante `MIN_REPORT_TITLE_LENGTH`. |
| **BS-C07** | ⚪ Dispensable | `create.tsx` | Estilos obsoletos `container` y `scrollContent` se declaraban en el stylesheet pero nunca se aplicaban al JSX. | **Dead Code Removal**: Se limpiaron los estilos sin referencias. |

---

### 3. Feature: Reports (Mis Reportes & Detalle de Reporte)

| Código Smell | Tipo de Smell | Ubicación Original | Descripción | Solución Aplicada |
| :--- | :--- | :--- | :--- | :--- |
| **BS-R01** | 🔴 Bloater (Large Class) | `reports.tsx` | Gestión directa en pantalla de filtros de pestañas, carga de BD y lógica de actualización pull-to-refresh. | **Extract Hook**: Se creó el custom hook `useMyReports.ts` para resolver de forma limpia la procedencia de los datos. |
| **BS-R02** | 🔴 Bloater (Large Class) | `[id].tsx` | El detalle cargaba en paralelo 3 orígenes de datos distintos mediante un `Promise.all` y manejaba errores y estados locales en la UI. | **Extract Hook**: Se introdujo el custom hook `useReportDetail.ts` para separar responsabilidades. |
| **BS-R03** | 🟠 OO Abuser | `reports.tsx` | La pestaña seleccionada aplicaba un largo `if/else` condicional imperativo con cadenas hardcodeadas para filtrar reportes. | **Table-driven logic**: Se definió un diccionario de mapeo de estados estático (`STATUS_FILTER_MAP`), reemplazando los condicionales por búsquedas indexadas. |

---

### 4. Feature: Notifications (Notificaciones de Estado)

| Código Smell | Tipo de Smell | Ubicación Original | Descripción | Solución Aplicada |
| :--- | :--- | :--- | :--- | :--- |
| **BS-N01** | 🔴 Bloater (Large Class) | `notifications.tsx` | Lógica de marcado como leída en la BD al interactuar y efectos colaterales de navegación metidos en la interfaz. | **Extract Hook**: Se implementó `useNotificationsList.ts` aislando el comportamiento transaccional del UI. |
| **BS-N02** | 🔴 Bloater (Bloated JSX) | `notifications.tsx` | La maqueta completa de la tarjeta de alerta vivía inline dentro de la lista. | **Extract Component**: Se creó la sub-vista reutilizable `NotificationCard.tsx`. |
| **BS-N03** | 🟠 OO Abuser | `notifications.tsx` | La asignación de iconos y colores según la alerta usaba un condicional `switch-case` acoplado al string de base de datos. | **Table-driven logic**: Se mapeó la relación mediante el diccionario estático de configuración `NOTIFICATION_TYPE_CONFIG`. |

---

### 5. Feature: Profile (Perfil y Reputación del Ciudadano)

| Código Smell | Tipo de Smell | Ubicación Original | Descripción | Solución Aplicada |
| :--- | :--- | :--- | :--- | :--- |
| **BS-P01** | 🟠 OO Abuser / Change Preventer | `profile.tsx` | El cálculo del rango del ciudadano de Tarija y sus colores específicos (`#10B981`, `#8B5CF6`) estaban en un bloque `if/else` hardcodeado en la pantalla. | **Table-driven logic & Replace Magic Number**: Se extraxo la configuración a la constante `REPUTATION_RANKS` y se creó la función resolutora pura `getUserRank(points)` en un módulo independiente (`reputation.ts`). |

---

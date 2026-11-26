# Progreso

Diario vivo. Se actualiza al cerrar cada sesión (tres líneas bastan). Lo más reciente va arriba.

## Estado actual

- **Fase:** proyecto 1, HU-01 a HU-05 completas; pruebas, CI, manejo de errores y despliegue en Vercel listos; falta cerrar DoD.
- **Proyecto en curso:** 1, gestor de tareas (CRUD) con Next.js.
- **Siguiente paso:** completar capturas reales y la sección “Qué aprendí” en el README del proyecto.
- **Tarjetas en curso (máx. 2):** ninguna todavía.

## Registro de sesiones

### 2026-11-26: despliegue en Vercel y limpieza de entorno

- Se desplegó el Proyecto 1 en Vercel (`https://portafolio-fullstack-nine.vercel.app/`) con API conectada a Neon.
- Se eliminó `NEXT_PUBLIC_APP_URL` no utilizada y se ajustó CI para incluir env vars en `pnpm install` por el `postinstall` de Prisma. PRs #21 y #24 fusionados.

### 2026-11-26: pulido UI Bloques 1 y 2 en Proyecto 1 (rama feat/ui-polish-bloques-1-2)

- Se aplicó la mini-spec de pulido UI en `proyectos/01-gestor-tareas`: `lang="es"`, metadata del producto y tipografía Geist consistente; contenedor/espaciado para evitar solapamiento con el toggle; estilos unificados en formulario, filtros, lista, alerta y vacío.
- Se agregó estado de carga inicial (“Cargando tareas...”), estado en español (“Pendiente/Completada”), descripción debajo del título, botón “Eliminar” destructivo, `focus-visible`, filtros con `aria-pressed` y corrección del flicker del icono en `ThemeToggle`.
- Verificación: `pnpm exec biome check --write .`, `pnpm test` (13/13) y `pnpm build` en verde. Sin commit ni push. Pendiente: revisión humana/visual y PR.

### 2026-11-26: botón de tema claro/oscuro en Proyecto 1 (rama feat/theme-toggle)

- Se agregó `ThemeToggle` (cliente) en `app/layout.tsx`, con script inline para aplicar el tema antes del render, persistencia en `localStorage` y `@custom-variant dark` en `app/globals.css` (se eliminó `prefers-color-scheme`).
- Verificación: `pnpm exec biome check --write .` y `pnpm test` (13/13) en verde. Sin commit ni push.
- Pendiente: revisión humana, PR y validación visual en navegador. Duda: confirmar si el icono de bombillo (relleno en oscuro, contorno en claro) y la posición fija superior derecha cumplen la expectativa visual.

### 2026-11-26: hallazgos bajos de manejo de errores cerrados

- Se agregaron `error.tsx` y `global-error.tsx`, y parseo defensivo de JSON en la UI para respuestas de error no válidas.
- PR #19 fusionado.

### 2026-11-26: manejo de errores mejorado y README base

- Se corrigieron hallazgos medios de manejo de errores en la UI: error global visible, recarga consistente y limpieza de formulario solo tras recarga exitosa.
- Se agregó README base del Proyecto 1 con placeholders para capturas y “Qué aprendí”. PR #17 fusionado.

### 2026-11-26: CI en GitHub Actions configurado

- Se agregó workflow `.github/workflows/ci.yml` para instalar, generar Prisma, correr Biome, tests y build en PR/push a `main`.
- PR #15 fusionado con checks en verde.

### 2026-11-26: pruebas automatizadas base agregadas

- Se configuró Vitest y se agregaron 13 pruebas de API cubriendo CRUD y validaciones clave (CA-1.1, CA-2.2, CA-3.1, CA-4.1, CA-4.2 y rechazos básicos).
- Quedan gaps conocidos: más casos 400 y pruebas de integración real con BD. PR #13 fusionado.

### 2026-11-26: HU-03 editar tarea completada

- Se extendió `PATCH /api/tareas/[id]` para `title`/`description` y se agregó edición inline en la UI.
- Se verificaron CA-3.1 y CA-3.2; PR #11 fusionado. HU-01 a HU-05 completas.

### 2026-11-26: HU-04 cambiar estado completada

- Se implementó soporte de `status` en `PATCH /api/tareas/[id]` y toggle en la UI.
- Se verificaron CA-4.1 y CA-4.2; PR #9 fusionado.

### 2026-11-26: HU-05 eliminar tarea completada

- Se implementó `DELETE /api/tareas/[id]` y botón Eliminar en la UI.
- Se verificaron CA-5.1 y CA-5.2; PR #7 fusionado.

### 2026-11-25: HU-02 listar/filtrar completada

- Se agregó filtro por `status` en `GET /api/tareas` y controles Todas/Pendientes/Completadas en la UI.
- Se verificaron CA-2.1, CA-2.2 y CA-2.3; PR #5 fusionado.

### 2026-11-24: HU-01 crear tarea completada (corte vertical)

- Se implementó `POST/GET /api/tareas` y una UI mínima con formulario y lista básica.
- Se verificaron CA-1.1 y CA-1.2 en navegador; PR #3 fusionado.

### 2026-11-24: base de datos y Prisma configurados

- Se configuró Prisma 7 con PostgreSQL (Neon), se definió el modelo `Tarea` según la spec y se aplicó la migración inicial `init_tarea`.
- Se verificó la conexión de extremo a extremo contra Neon (crear, leer y eliminar una tarea de prueba).
- PR de configuración de base de datos fusionado.

### 2026-11-23: entorno inicial del proyecto 1 completado

- Se inicializó `proyectos/01-gestor-tareas` con Next.js, TypeScript, Biome (linter/formateador) y `.env.example`.
- Se hizo público el repositorio, se verificó/configuró la protección de `main` y se dejó listo el tablero de GitHub Projects.
- Queda pendiente hacer push/PR de `feat/entorno-inicial` y confirmar Neon como base de datos.

### 2026-11-22: diseño mínimo del proyecto 1 completado

- Se completó la etapa 2 del proyecto 1: modelo de datos ajustado a PostgreSQL/Prisma, lista de endpoints definida en `specs/01-gestor-de-tareas.md` y wireframe de baja fidelidad validado contra HU-01 a HU-05.
- Queda pendiente la confirmación de Neon como base de datos gestionada (decisión aún abierta).

### 2026-11-21: spec del proyecto 1 revisada y elección de ORM

- Se revisó `specs/01-gestor-de-tareas.md`: se alineó la persistencia a PostgreSQL (Neon) + Prisma y se completó la definición de terminado con los criterios del portafolio.
- Decisión: se eligió **Prisma** como ORM por menor conocimiento técnico de SQL y una API más natural para empezar.

### 2026-11-20: definición del ciclo y del stack

Decisiones tomadas:

- Tiempo disponible: 5 horas semanales.
- Metodología: Kanban + prácticas de XP, spec ligera al inicio, TDD en lógica crítica, Scrum solo como vocabulario.
- Portafolio de 5 proyectos: 3 integrados con Next.js y 2 con frontend y backend separados (ver `PROYECTO.md`).
- Base de datos: PostgreSQL para todos, por la vinculación interna de los datos y la escalabilidad.
- Se trabajará de forma compartida entre varias herramientas de IA (chat de Claude, Gemini y opencode; Claude Code solo si hay plan de pago), usando estos archivos como contexto común.
- **Todo gratuito:** ninguna herramienta ni servicio de pago. Base de datos en Neon Free; despliegue en Vercel Hobby y Render Free; Railway queda fuera del plan.
- Monorepo: el repositorio es el portafolio y cada proyecto vive en proyecto/NN-nombre

## Decisiones pendientes

- Confirmar Neon como base de datos (Supabase queda como alternativa).

## Lecciones aprendidas

(Se completan en la retrospectiva de cada proyecto.)

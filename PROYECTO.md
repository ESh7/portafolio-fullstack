# Portafolio full stack: definición del proyecto

Documento maestro. Resume todo lo decidido antes de escribir código. Si una decisión cambia, se edita aquí y se anota el motivo en `PROGRESO.md`.

Última revisión: 20 de noviembre de 2026.

## 1. Objetivo

Construir un portafolio de desarrollador web full stack con 5 proyectos terminados, desplegados y documentados, para desarrollar habilidades y poder mostrar un recorrido completo en entrevistas y plataformas de trabajo remoto.

Principio rector: **5 proyectos bien terminados valen más que 10 a medias.**

## 2. Tiempo disponible

- **5 horas semanales** dedicadas a los proyectos.
- Reparto sugerido en tres sesiones:
  1. **Planear (aprox. 1 h):** revisar el tablero, elegir 1 o 2 tareas y escribir su criterio de aceptación. El resto de la sesión, código.
  2. **Construir (2 h):** desarrollo en una rama, commits pequeños.
  3. **Cerrar (2 h):** pruebas, pull request, fusionar, desplegar y anotar lo aprendido.
- Regla clave: **cada semana termina con algo funcionando en la rama principal.**

## 3. Metodología

Combinación pensada para trabajo individual:

- **Kanban** para organizar el trabajo.
- **Prácticas de XP** para el código: commits pequeños, integración continua y refactorización constante.
- **TDD** solo en funciones pequeñas y críticas (lógica de negocio). En el resto, pruebas después de escribir el código. Sin TDD estricto en el frontend.
- **SDD ligero (spec primero):** una spec de una página antes de cada proyecto. Es también el contexto que se entrega a las herramientas de IA.
- **Tiempo cerrado de Shape Up:** el plazo es fijo y el alcance se recorta, no el plazo.
- **Scrum** solo como vocabulario (sprint, backlog, retrospectiva), sin practicar el ritual completo.
- Cascada y RUP: saber qué son y dónde aparecen, nada más por ahora.

### Tablero Kanban

- Herramienta: GitHub Projects (vive junto al código).
- Columnas: **Backlog, Esta semana, En curso, En revisión, Hecho.**
- Regla única: **máximo 2 tarjetas en "En curso".**

## 4. Ciclo por proyecto (6 etapas, versión ligera)

1. **Spec de una página.** Problema que resuelve, 3 a 5 historias de usuario ("como usuario quiero... para..."), qué queda fuera del MVP y la definición de "terminado". Se escribe en la primera sesión del proyecto.
2. **Diseño mínimo.** Wireframe en papel o Figma básico, modelo de datos con un diagrama simple y lista de endpoints. Máximo una sesión.
3. **Entorno.** Repositorio con rama principal protegida, tablero Kanban, linter, formateador y variables de entorno. Esta base se reutiliza entre proyectos.
4. **Desarrollo en incrementos.** Una rama por funcionalidad y un pull request por rama (aunque lo apruebe yo mismo). Commits con mensajes descriptivos.
5. **Pruebas.** Pruebas de la lógica de negocio y de la API desde el proyecto 2. Flujo de extremo a extremo en los proyectos 4 y 5.
6. **CI/CD y despliegue desde el primer proyecto.** GitHub Actions corre las pruebas y despliega automáticamente.

Al cerrar cada proyecto: **retrospectiva de 15 minutos** (qué salió bien, qué frenó, qué cambio en el siguiente).

## 5. Definición de "terminado"

Un proyecto se da por cerrado solo si cumple todo esto:

- Desplegado, con enlace funcional.
- README con: problema que resuelve, tecnologías, capturas, cómo ejecutarlo y qué aprendí.
- Pruebas básicas pasando en CI.
- Manejo de errores en los flujos principales.
- Historial de Git limpio.

## 6. Los 5 proyectos

El reparto mezcla proyectos integrados (frontend y backend en un solo framework) y proyectos con frontend y backend separados, para entender mejor el stack y ampliar habilidades.

### Integrados con Next.js

| N.º | Proyecto | Qué se practica |
|---|---|---|
| 1 | Gestor de tareas (CRUD) | Rutas, componentes, API routes, base de datos con un dominio simple |
| 2 | Blog o CMS con panel de administración | Autenticación, roles, relaciones entre tablas |
| 3 | Gestor de gastos con gráficas | Formularios complejos, filtros por fecha, reportes, diseño de datos |

### Frontend y backend separados

| N.º | Proyecto | Qué se practica |
|---|---|---|
| 4 | Sistema de reservas o citas | API con lógica de negocio (disponibilidad, confirmaciones, correos) consumida por un cliente React |
| 5 | Mini-LMS con roles (cursos, lecciones, inscripciones, progreso) | Proyecto final que reúne todo. Puede orientarse a un contexto concreto (escuela, seminario) para diferenciarse |

### Plazos orientativos (a 5 h/semana)

- Proyecto 1: 2 a 3 semanas.
- Proyectos 2 y 3: 4 a 5 semanas cada uno.
- Proyectos 4 y 5: 6 a 8 semanas cada uno.
- Total aproximado: 6 a 7 meses.

### El salto del proyecto 3 al 4

Es el cambio más grande del plan. Al separar aparecen cosas que Next.js ocultaba: CORS, autenticación con tokens (JWT) o cookies entre dominios, dos despliegues distintos, variables de entorno en ambos lados y un contrato de API que hay que diseñar y documentar (por ejemplo con OpenAPI).

## 7. Stack

- **Proyectos 1 a 3:** Next.js con TypeScript, PostgreSQL y un ORM (Prisma o Drizzle).
- **Proyectos 4 y 5:** React (frontend) y Node con Express (API), con el mismo PostgreSQL y el mismo ORM.
- **Base de datos:** **PostgreSQL** en todos los proyectos. Motivo: los datos tienen mucha vinculación interna (usuarios, tareas, reservas, inscripciones) y permite escalabilidad.
- **Base de datos gestionada gratuita:** Neon (plan Free permanente, sin tarjeta). Alternativa: Supabase (límites más ajustados y se pausa por inactividad).
- **CI/CD:** GitHub Actions en repositorios públicos.
- **Despliegue:** Vercel plan Hobby (Next.js y frontend de React); Render plan Free para la API de los proyectos 4 y 5.
- **Pruebas:** Vitest o Jest para la lógica; Playwright para extremo a extremo más adelante.
- **Gestión:** GitHub Projects.

### Regla de gratuidad

Todo el portafolio debe poder construirse y desplegarse **sin pagar nada**. Condiciones y límites a tener presentes (verificados en noviembre de 2026; confirmar en las páginas oficiales antes de depender de ellos):

- **Vercel Hobby:** gratuito solo para uso personal y no comercial. Un portafolio de aprendizaje encaja; un sitio de un cliente no. Si se supera un límite, la función se pausa, no se cobra.
- **Neon Free:** 1 GB por proyecto, 100 horas de cómputo al mes por proyecto, sin tarjeta. El cómputo se apaga tras 5 minutos sin uso, así que la primera consulta tras una pausa es algo más lenta.
- **Render Free (web services):** el servicio se duerme tras 15 minutos sin tráfico y tarda alrededor de un minuto en despertar. El sistema de archivos es efímero (no guardar archivos subidos en disco). **No usar la base de datos gratuita de Render: expira a los 30 días.** La base de datos siempre va en Neon.
- **Railway:** fuera del plan, porque no se verificó una opción gratuita permanente.
- **Herramientas de IA gratuitas:** opencode con modelos gratuitos de Zen, Gemini CLI con cuenta personal de Google (cuota diaria limitada) y el chat gratuito de Claude. Claude Code requiere un plan de pago, así que no es parte obligatoria del flujo.
- Nunca ingresar una tarjeta de crédito ni activar facturación por uso en ningún servicio. Si un servicio la exige, se sustituye por otro.

## 8. Seguridad y datos sensibles

- Nunca guardar contraseñas, cadenas de conexión ni claves de API en el repositorio ni en estos archivos.
- Los secretos van en variables de entorno (`.env` fuera de Git, con un `.env.example` sin valores reales).

## 9. Flujo de Git

- Rama `main` protegida.
- Una rama por funcionalidad (`feat/...`, `fix/...`) y pull request hacia `main`.
- Commits pequeños con mensajes descriptivos y formato consistente (por ejemplo, Conventional Commits).

## 10. Estructura sugerida del repositorio de contexto

```
portafolio/
├── AGENTS.md        (instrucciones comunes para todas las herramientas de IA)
├── CLAUDE.md        (una línea: @AGENTS.md)
├── GEMINI.md        (apunta a AGENTS.md)
├── PROYECTO.md      (este documento)
├── PROGRESO.md      (diario vivo)
└── specs/
    └── 01-gestor-de-tareas.md
```

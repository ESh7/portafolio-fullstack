# Gestor de tareas (Proyecto 1)

Aplicación web para gestionar tareas personales con operaciones CRUD, filtros por estado y persistencia en PostgreSQL.

## Problema que resuelve

Un usuario individual necesita registrar, consultar, actualizar y cerrar sus tareas diarias desde un único lugar persistente. Este proyecto evita perder pendientes en notas sueltas o listas volátiles que se pierden al cerrar la sesión.

## Funcionalidades

El MVP cubre las historias de usuario definidas en [`specs/01-gestor-de-tareas.md`](../../specs/01-gestor-de-tareas.md):

- **HU-01 - Crear una tarea:** permite crear una tarea con título obligatorio (1 a 120 caracteres) y descripción opcional. La tarea se guarda con estado `pending`.
- **HU-02 - Listar y filtrar tareas:** muestra las tareas ordenadas de más reciente a más antigua y permite filtrar por `todas`, `pendientes` o `completadas`. Si no hay resultados, muestra un estado vacío claro.
- **HU-03 - Editar el contenido de una tarea:** permite modificar título o descripción con datos válidos. Si el título queda vacío, se rechaza el cambio.
- **HU-04 - Cambiar el estado de una tarea:** permite marcar una tarea como `completed` o reabrirla como `pending`, con persistencia tras recargar.
- **HU-05 - Eliminar una tarea:** elimina la tarea de la vista y de la base de datos; no vuelve a aparecer tras recargar.

## Tecnologías

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **PostgreSQL** en Neon
- **Prisma 7** como ORM
- **Biome** para lint y formato
- **Vitest** para pruebas automatizadas
- **GitHub Actions** para CI (cuando el flujo esté configurado en el repositorio)
- **pnpm** como gestor de paquetes

## Capturas

![Vista principal del gestor de tareas](docs/capturas/gestor-tareas.png)

## Cómo ejecutarlo localmente

### Prerrequisitos

- Node.js 20 o superior
- pnpm
- Una base de datos PostgreSQL (por ejemplo, Neon)

### 1. Configurar variables de entorno

Copia el archivo de ejemplo y completa los valores en tu entorno local:

```bash
cp .env.example .env
```

Variables definidas en `.env.example`:

- `DATABASE_URL`: cadena de conexión para el cliente/adapter de PostgreSQL.
- `DIRECT_URL`: conexión directa usada por Prisma para migraciones.

> No compartas ni subas valores reales de `.env` al repositorio.

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Generar cliente de Prisma y aplicar migraciones

```bash
pnpm exec prisma generate
pnpm exec prisma migrate dev
```

### 4. Iniciar el servidor de desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### 5. Ejecutar pruebas

```bash
pnpm test
```

Otros comandos útiles:

```bash
pnpm lint
pnpm check
pnpm build
```

## CI

El proyecto incluye scripts para validación local y CI:

- `pnpm lint`: ejecuta Biome en modo lint.
- `pnpm check`: ejecuta las verificaciones de Biome.
- `pnpm test`: ejecuta las pruebas con Vitest.
- `pnpm build`: genera el build de producción de Next.js.

La integración continua del portafolio se plantea con GitHub Actions. Si agregas o actualizas un workflow, asegúrate de que ejecute al menos las comprobaciones relevantes (lint/check, pruebas y build, según corresponda).

## Qué aprendí

Aprendí la estructura de un proyecto y el flujo de trabajo completo: desde la idea o historia de usuario hasta el despliegue de la app. También practiqué el uso de tecnologías como GitHub, Vercel y Prisma, y entendí mejor las posibilidades de los servicios serverless como Neon. Además, confirmé la utilidad y solidez de la terminal en todo el desarrollo de una app con API y endpoints.

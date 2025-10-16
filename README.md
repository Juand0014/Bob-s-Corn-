# Bob's Corn - Monorepo

Un monorepo simple con Next.js (frontend) y NestJS (backend) usando PostgreSQL.

## Estructura del proyecto

```
├── apps/
│   ├── frontend/    # Next.js app (puerto 3000)
│   └── backend/     # NestJS API (puerto 3001)
├── packages/
│   └── shared/      # Tipos y utilidades compartidas
└── docker-compose.yml
```

## Desarrollo local

### Sin Docker

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar ambas aplicaciones:

```bash
npm run dev
```

Esto ejecutará el frontend en http://localhost:3000 y el backend en http://localhost:3001

### Híbrido (DB en Docker, Apps locales)

1. Ejecutar base de datos en Docker y apps localmente:

```bash
npm run dev:hybrid
```

2. Solo base de datos:

```bash
npm run docker:db:up
```

3. Detener solo la base de datos:

```bash
npm run docker:db:down
```

### Todo con Docker

1. Ejecutar todo con Docker:

```bash
npm run docker:up
```

2. Ver logs:

```bash
npm run docker:logs
```

3. Detener:

```bash
npm run docker:down
```

## Scripts disponibles

### Desarrollo local
- `npm run dev` - Ejecuta frontend y backend localmente (sin DB)
- `npm run dev:hybrid` - DB en Docker, frontend y backend locales

### Solo base de datos
- `npm run docker:db:up` - Solo base de datos en Docker
- `npm run docker:db:down` - Detiene solo la base de datos
- `npm run docker:db:logs` - Logs de la base de datos

### Todo con Docker
- `npm run docker:up` - Ejecuta todo en Docker
- `npm run docker:down` - Detiene todos los contenedores
- `npm run docker:logs` - Muestra logs de Docker

## URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Base de datos: PostgreSQL en puerto 5432

## Tecnologías

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript
- **Base de datos**: PostgreSQL
- **Containerización**: Docker & Docker Compose
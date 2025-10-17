# Bob's Corn Monorepo

Un monorepo full-stack con Next.js, NestJS, y tipos TypeScript compartidos usando `@packages` aliases.

## 🚀 Inicio Rápido

```bash
# 1. Instalación
npm install

# 2. Base de datos (Docker)
docker-compose up -d

# 3. Desarrollo completo
npm run dev
```

## 📦 Configuración de @packages

Este monorepo usa `@packages` como alias para importaciones limpias:

```typescript
// ✅ Con @packages (limpio)
import { User, PurchaseRequest } from '@packages/shared';

// ❌ Sin alias (complicado) 
import { User } from '../../../../packages/shared/src/types';
```

### Configuración TypeScript

**Backend (`apps/backend/tsconfig.json`)**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@packages/*": ["../../packages/*"]
    }
  }
}
```

**Frontend (`apps/frontend/tsconfig.json`)**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@packages/*": ["../../packages/*"]
    }
  }
}
```

### Runtime Support

**Backend** (`src/main.ts`):
```typescript
import 'tsconfig-paths/register';  // ← Resuelve @packages
```

**Scripts** (`package.json`):
```json
{
  "dev": "ts-node -r tsconfig-paths/register src/main.ts"
}
```

## 🏷️ Tipos Compartidos

### Interfaces Disponibles

```typescript
// packages/shared/src/types.ts
export interface PurchaseRequest {
  userId: string;
}

export interface PurchaseResponse {
  success: boolean;
  message: string;
  cornsPurchased?: number;
  nextAvailableAt?: Date;
}

export interface User {
  id: string;
  lastPurchase?: Date;
  totalCorns: number;
}
```

### Uso en Backend

```typescript
import { PurchaseRequest, PurchaseResponse } from '@packages/shared';

@Post()
async purchase(@Body() body: PurchaseRequest): Promise<PurchaseResponse> {
  // Implementación tipada
}
```

### Uso en Frontend

```typescript
import { PurchaseRequest, PurchaseResponse } from '@packages/shared';

const data: PurchaseResponse = await response.json();
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Frontend + Backend + PostgreSQL
- `npm run frontend:dev` - Solo Next.js (puerto 3000)
- `npm run backend:dev` - Solo NestJS (puerto 3001)

## 🌐 API Endpoints

### Base URL
- **Desarrollo**: http://localhost:3001
- **Swagger**: http://localhost:3001/api/docs

### POST /purchase
```json
// Request
{ "userId": "user123" }

// Response (Success)
{
  "success": true,
  "message": "Purchase successful!",
  "cornsPurchased": 1,
  "nextAvailableAt": "2025-10-16T22:14:12.113Z"
}
```

## 🗄️ Base de Datos

**PostgreSQL** (Docker):
- Host: localhost:5432
- Usuario: postgres
- Password: postgres123
- DB: bobs_corn

## 🏗️ Estructura

```
Bob-s-Corn-/
├── apps/
│   ├── frontend/          # Next.js 15 + Tailwind
│   └── backend/           # NestJS + TypeORM + PostgreSQL
├── packages/
│   └── shared/            # Tipos compartidos con @packages
├── docker-compose.yml     # PostgreSQL
└── package.json          # Scripts del monorepo
```

## ✨ Características

- ✅ **Monorepo con npm workspaces**
- ✅ **@packages aliases para imports limpios**
- ✅ **Tipos TypeScript compartidos**
- ✅ **Hot reload en desarrollo**
- ✅ **PostgreSQL + TypeORM**
- ✅ **Swagger API documentation**
- ✅ **Rate limiting (1/minuto)**
- ✅ **CORS configurado**

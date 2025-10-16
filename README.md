# Bob's Corn Monorepo 🌽

Un monorepo para la aplicación Bob's Corn, que incluye un frontend desarrollado con Next.js y un backend desarrollado con NestJS.

## 🏗️ Estructura del Proyecto

```
Bob-s-Corn-/
├── apps/
│   ├── frontend/          # Aplicación Next.js (React)
│   └── backend/           # API NestJS (Node.js)
├── packages/
│   └── shared/            # Tipos y utilidades compartidas
├── tools/                 # Herramientas de desarrollo
├── package.json           # Configuración del workspace
├── tsconfig.json          # Configuración TypeScript global
├── .eslintrc.json         # Configuración ESLint
├── .prettierrc.json       # Configuración Prettier
└── README.md
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- npm 9+

### Instalación

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd Bob-s-Corn-
```

2. Instala las dependencias:
```bash
npm install
```

3. Construye el paquete compartido:
```bash
npm run build --workspace=packages/shared
```

## 🛠️ Scripts Disponibles

### Scripts Globales (desde la raíz)

- `npm run dev` - Inicia todos los proyectos en modo desarrollo
- `npm run build` - Construye todos los proyectos
- `npm run start` - Inicia todos los proyectos en modo producción
- `npm run test` - Ejecuta tests en todos los proyectos
- `npm run lint` - Ejecuta linting en todos los proyectos
- `npm run lint:fix` - Corrige automáticamente errores de linting
- `npm run type-check` - Verifica tipos TypeScript en todos los proyectos
- `npm run clean` - Limpia todas las carpetas de build

### Scripts Específicos

#### Frontend (Next.js)
```bash
npm run frontend:dev    # Desarrollo
npm run frontend:build  # Build
npm run frontend:start  # Producción
```

#### Backend (NestJS)
```bash
npm run backend:dev     # Desarrollo
npm run backend:build   # Build
npm run backend:start   # Producción
```

#### Paquete Compartido
```bash
npm run build --workspace=packages/shared    # Build
npm run dev --workspace=packages/shared      # Watch mode
```

## 🌐 Desarrollo Local

### 1. Iniciar Frontend (Next.js)
```bash
npm run frontend:dev
```
El frontend estará disponible en: `http://localhost:3000`

### 2. Iniciar Backend (NestJS)
```bash
npm run backend:dev
```
El backend estará disponible en: `http://localhost:3001`

### 3. Iniciar Todo Junto
```bash
npm run dev
```

## 📦 Aplicaciones

### Frontend (`apps/frontend`)
- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Linting**: ESLint + Prettier
- **Puerto**: 3000

#### Características:
- ✅ App Router de Next.js
- ✅ TypeScript configurado
- ✅ Tailwind CSS para estilos
- ✅ ESLint y Prettier
- ✅ Configuración de importación con alias `@/*`

### Backend (`apps/backend`)
- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos**: Por configurar
- **Testing**: Jest
- **Puerto**: 3001 (por defecto 3000, cambiar si es necesario)

#### Características:
- ✅ Arquitectura modular de NestJS
- ✅ TypeScript configurado
- ✅ Testing con Jest
- ✅ ESLint y Prettier
- ✅ Estructura de controladores y servicios

### Paquete Compartido (`packages/shared`)
- **Propósito**: Tipos, interfaces y utilidades compartidas
- **Exportaciones**: 
  - Tipos TypeScript (User, Product, Order, etc.)
  - Utilidades (formatCurrency, validateEmail, etc.)
  - Interfaces de API

## 🔧 Configuración

### TypeScript
- Configuración base en `tsconfig.json`
- Path mapping configurado para importaciones limpias
- Configuraciones específicas por proyecto

### ESLint & Prettier
- Reglas compartidas en `.eslintrc.json`
- Configuración de Prettier en `.prettierrc.json`
- Overrides específicos para Next.js y NestJS

### Workspaces
- Configurado con npm workspaces
- Dependencias compartidas hoisted
- Scripts que funcionan en todos los proyectos

## 📁 Estructura de Carpetas Detallada

```
apps/
├── frontend/
│   ├── src/
│   │   ├── app/              # App Router de Next.js
│   │   └── components/       # Componentes React
│   ├── public/              # Assets estáticos
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
└── backend/
    ├── src/
    │   ├── app.controller.ts
    │   ├── app.module.ts
    │   ├── app.service.ts
    │   └── main.ts
    ├── test/
    ├── package.json
    └── tsconfig.json

packages/
└── shared/
    ├── src/
    │   ├── index.ts          # Exportaciones principales
    │   ├── types.ts          # Interfaces y tipos
    │   └── utils.ts          # Funciones de utilidad
    ├── package.json
    └── tsconfig.json
```

## 🎯 Próximos Pasos

1. **Configurar Variables de Entorno**
   - Crear archivos `.env` para cada aplicación
   - Configurar conexión a base de datos en el backend

2. **Implementar Funcionalidades Core**
   - Sistema de autenticación
   - CRUD de productos (corn-related)
   - Sistema de órdenes

3. **Setup de Base de Datos**
   - Elegir e instalar ORM (TypeORM, Prisma, etc.)
   - Configurar migraciones
   - Crear modelos de datos

4. **Testing**
   - Configurar testing E2E
   - Escribir tests unitarios
   - Setup de CI/CD

5. **Deployment**
   - Configurar Docker
   - Setup para Vercel (frontend) y Heroku/Railway (backend)

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🌽 Sobre Bob's Corn

Una aplicación completa para gestión de productos relacionados con el maíz, incluyendo catálogo, órdenes y más funcionalidades por venir.

---

**¡Feliz coding! 🚀**
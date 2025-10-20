# Bob's Corn 🌽

A full-stack corn purchasing app with Redis-based rate limiting.

## Description

Bob's Corn demonstrates a rate-limited purchasing system where users can buy corn once per minute. Built with Next.js, NestJS, PostgreSQL, and Redis.

Features:
- Rate limiting (1 purchase per minute)
- Sliding window algorithm with Redis
- Shared TypeScript types
- Real-time updates

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Docker & Docker Compose

### Installation

1. Clone and install
```bash
git clone https://github.com/Juand0014/Bob-s-Corn-.git
cd Bob-s-Corn-
npm install
```

2. Set up environment
```bash
cp .env.example .env
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.env.example apps/backend/.env
```

3. Start services
```bash
npm run dev:local     # Start all, apps in the local and up docker container
```

Visit front http://localhost:3000
Visit back http://localhost:3000/api

### Environment Variables

**Backend (.env)**
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=bobs_corn_db

REDIS_HOST=localhost
REDIS_PORT=6379

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=1

PORT=3001
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env.local)**
```env
NODE_ENV=development

NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Testing

```bash
npm run test
npm run lint
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, React Query
- **Backend**: NestJS, TypeORM, Redis
- **Database**: PostgreSQL, Redis
- **Shared**: TypeScript types with `@packages` aliases

### Rate Limiting
Uses Redis sorted sets for sliding window rate limiting:
- Tracks request timestamps
- Automatically cleans expired requests
- Prevents request bursts at window boundaries

### Project Structure
```
Bob-s-Corn-/
├── apps/
│   ├── frontend/        # Next.js app
│   └── backend/         # NestJS API
├── packages/
│   └── shared/          # Shared TypeScript types
├── docker-compose.yml   # Full stack
└── docker-compose.db.yml # Databases only
```

## API Endpoints

**POST /purchase**
```json
Request: { "userId": "user123" }
Response: {
  "success": true,
  "message": "Corn purchased! 🌽",
  "cornsPurchased": 1,
  "nextAvailableAt": "2025-10-20T15:30:00.000Z"
}
```

**GET /purchase/:userId**
```json
Response: {
  "userId": "user123",
  "totalCorns": 5,
  "lastPurchase": "2025-10-20T15:28:30.000Z"
}
```

Rate limited responses return 429 status with retry information.

## Docker

**Full stack:**
```bash
npm run docker:up
npm run docker:down
```

**Databases only:**
```bash
npm run docker:db:up
npm run docker:db:down
```

## Scripts

### Development
```bash
npm run dev              # Frontend + Backend
npm run dev:local        # Include databases
npm run frontend:dev     # Frontend only (port 3000)
npm run backend:dev      # Backend only (port 3001)
```

### Production
```bash
npm run build
npm run start
```

### Utilities
```bash
npm run test             # Run tests
npm run lint             # Check code quality
npm run clean            # Clean node_modules
```

## Limitations

- No authentication system
- Rate limiting resets on Redis restart
- Limited to single backend instance
- No comprehensive test coverage
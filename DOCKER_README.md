# 🐳 Docker Setup for Bob's Corn Monorepo

This document explains how to use Docker with Bob's Corn application in different development scenarios.

## 📋 Quick Start

### 1. Copy Environment Variables
```bash
cp .env.example .env
# Edit .env file with your preferred settings
```

### 2. Choose Your Development Mode

#### **Full Docker (All services in containers)**
```bash
npm run docker:up
# Visit: http://localhost:3000 (Frontend)
# API: http://localhost:3001 (Backend)
```

#### **Hybrid Mode (DB in Docker, Apps local)**
```bash
npm run dev:local
# This starts PostgreSQL + Redis in Docker, Frontend + Backend locally
```

#### **Database Only (Most common for development)**
```bash
npm run docker:db
npm run dev
# Starts only PostgreSQL in Docker, runs apps locally
```

---

## 🛠️ Available Commands

### Docker Management
```bash
# Build all Docker images
npm run docker:build

# Start all services (detached mode)
npm run docker:up

# Stop all services
npm run docker:down

# View logs from all services
npm run docker:logs

# Clean up containers, volumes, and images
npm run docker:clean

# Start with all optional services (Nginx + Redis)
npm run docker:full
```

### Database Only Commands
```bash
# Start only PostgreSQL
npm run docker:db

# Stop database
npm run docker:db:down

# View database logs
npm run docker:db:logs

# Start database + pgAdmin
npm run docker:pgadmin
```

### Hybrid Development
```bash
# Database + Redis in Docker, Apps local
npm run docker:hybrid

# Stop hybrid services
npm run docker:hybrid:down

# Full hybrid development (starts DB + local apps)
npm run dev:local
```

### Individual Builds
```bash
# Build only frontend image
npm run docker:build:frontend

# Build only backend image  
npm run docker:build:backend

# Start in development mode
npm run docker:dev

# Start in production mode
npm run docker:prod
```

---

## 🏗️ Docker Compose Files

### `docker-compose.yml` - Full Production Setup
- **Frontend**: Next.js application
- **Backend**: NestJS API
- **Database**: PostgreSQL with initialization
- **Nginx**: Reverse proxy (optional)
- **Redis**: Caching layer (optional)

### `docker-compose.dev.yml` - Database Only
- **Database**: PostgreSQL for development
- **pgAdmin**: Database management UI (optional)

### `docker-compose.hybrid.yml` - Infrastructure Only  
- **Database**: PostgreSQL
- **Redis**: Session store and caching

---

## 🌐 Service URLs

### Development Mode
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001  
- **Database**: localhost:5432
- **pgAdmin**: http://localhost:5050
- **Redis**: localhost:6379

### With Nginx (Full Docker)
- **Application**: http://localhost:80
- **API**: http://localhost:80/api

---

## 📊 Database Access

### Connection Details
```
Host: localhost (or 'database' from within Docker)
Port: 5432
Database: bobs_corn_db
Username: postgres
Password: postgres123
```

### pgAdmin Access
```
URL: http://localhost:5050
Email: admin@bobscorn.com
Password: admin123
```

---

## 🔧 Docker Architecture

### Multi-stage Builds
Both frontend and backend use multi-stage builds:

**Development Stage**:
- Includes all dependencies
- Hot reloading enabled
- Source code mounted as volumes

**Production Stage**:
- Optimized images
- Only production dependencies
- Non-root user for security

### Networking
All services communicate through a custom bridge network:
- **Network Name**: `bobs-corn-network`
- **Internal DNS**: Services can reach each other by name
- **External Access**: Only specified ports are exposed

### Volumes
Persistent data storage:
- **postgres_data**: Database files
- **redis_data**: Redis persistence
- **Source volumes**: For development hot-reloading

---

## 🚀 Deployment Scenarios

### Local Development (Recommended)
```bash
npm run dev:local
```
- Database in Docker (consistent environment)
- Apps running locally (fast iteration)
- Best of both worlds

### Full Docker Development
```bash
npm run docker:dev
```
- All services containerized
- Consistent across team members
- Slower iteration due to container rebuilds

### Production Deployment
```bash
npm run docker:prod
```
- Optimized production images
- Security hardened
- Ready for cloud deployment

---

## 🔍 Troubleshooting

### Port Conflicts
If ports are already in use, change them in `.env`:
```env
FRONTEND_PORT=3001
BACKEND_PORT=3002
DATABASE_PORT=5433
```

### Database Connection Issues
1. Ensure PostgreSQL container is healthy:
   ```bash
   docker-compose logs database
   ```
2. Check if database is accepting connections:
   ```bash
   docker exec -it bobs-corn-db pg_isready -U postgres
   ```

### Container Build Issues
Clear Docker cache:
```bash
npm run docker:clean
docker system prune -a
npm run docker:build
```

### Volume Permission Issues (Linux/Mac)
```bash
sudo chown -R $USER:$USER ./docker/postgres/
```

---

## 📝 Environment Configuration

### .env Files
- `.env.example`: Template with all variables
- `.env.development`: Development settings
- `.env.production`: Production settings (secure defaults)
- `.env`: Your local configuration (gitignored)

### Key Variables
```env
NODE_ENV=development|production
DATABASE_URL=postgresql://user:pass@host:port/db
CORS_ORIGIN=http://localhost:3000
```

---

## 🎯 Best Practices

### For Development
1. Use `npm run dev:local` for daily development
2. Use `npm run docker:db` when you only need the database
3. Use full Docker when testing deployment scenarios

### For Production
1. Always use production environment files
2. Change all default passwords
3. Use HTTPS in production
4. Enable Nginx for reverse proxy
5. Set up proper logging and monitoring

---

## 📚 Docker Commands Reference

### Useful Docker Commands
```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs <container_name>

# Execute commands in running container
docker exec -it <container_name> /bin/sh

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune

# Remove all unused volumes
docker volume prune
```

### Database Operations
```bash
# Connect to PostgreSQL directly
docker exec -it bobs-corn-db psql -U postgres -d bobs_corn_db

# Backup database
docker exec bobs-corn-db pg_dump -U postgres bobs_corn_db > backup.sql

# Restore database
docker exec -i bobs-corn-db psql -U postgres -d bobs_corn_db < backup.sql
```

---

*Happy Dockerizing! 🌽🐳*
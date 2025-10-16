# Simple Next.js Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build shared package first
RUN npm run build --workspace=packages/shared

# Build Next.js application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build --workspace=apps/frontend

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/frontend"]
# Redis Rate Limiter Implementation

## Descripción

Implementación avanzada de rate limiting usando Redis con algoritmo de sliding window para el backend de Bob's Corn. Reemplaza la implementación anterior basada en base de datos con un sistema más eficiente y escalable.

## Características

- **Sliding Window Algorithm**: Seguimiento preciso de requests por ventana de tiempo deslizante
- **Redis Backend**: Alto rendimiento y escalabilidad
- **Middleware Automático**: Intercepta requests automáticamente
- **Headers HTTP**: Información de rate limit en las respuestas
- **Identificación por Cliente**: Combina IP + User-Agent para identificar clientes únicos
- **Configuración Flexible**: Variables de entorno para personalización

## Arquitectura

### Componentes Principales

1. **RedisService** (`src/redis/redis.service.ts`)
   - Manejo de conexión Redis con ioredis
   - Operaciones básicas (get, set, zadd, zremrangebyscore, etc.)
   - Reconexión automática y manejo de errores

2. **RateLimiterService** (`src/rate-limiter/rate-limiter.service.ts`)
   - Implementación del algoritmo sliding window
   - Lógica de rate limiting usando sorted sets de Redis
   - Cálculo de requests restantes y tiempo de reset

3. **RateLimiterMiddleware** (`src/rate-limiter/rate-limiter.middleware.ts`)
   - Middleware para interceptar requests automáticamente
   - Aplicación de headers HTTP estándar
   - Respuestas 429 cuando se excede el límite

### Algoritmo Sliding Window

```
Key: rate_limit:{clientId}
Value: Sorted Set con timestamps como score y member
Window: Se remueven entradas más antigas que windowMs
Límite: Cuenta total de entradas en el set
```text

## Configuración

### Variables de Entorno (.env)

```properties
# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=1

# Redis Configuration  
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Integración en App Module

```typescript
// app.module.ts
configure(consumer: MiddlewareConsumer): void {
  consumer
    .apply(RateLimiterMiddleware)
    .forRoutes({ path: '/purchase', method: RequestMethod.POST });
}
```

## Uso

### Headers de Respuesta

```http
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1698876000
Retry-After: 60
```

### Respuesta de Rate Limit Excedido

```json
{
  "message": "Rate limit exceeded",
  "retryAfter": 45,
  "resetTime": 1698875955000
}
```

## Instalación de Dependencias

```bash
npm install redis ioredis @nestjs/cache-manager cache-manager-redis-store
```

## Configuración de Redis

### Desarrollo Local

```bash
# Usando Docker
docker run -d --name redis -p 6379:6379 redis:alpine

# Usando Windows (chocolatey)
choco install redis-64
```

### Producción

Configurar variables de entorno para conectar a Redis Cloud, AWS ElastiCache, etc.

## API del RateLimiterService

### Métodos Públicos

- `checkRateLimit(clientId: string): Promise<RateLimitResult>`
- `enforceRateLimit(clientId: string): Promise<void>`
- `getRemainingRequests(clientId: string): Promise<number>`
- `resetRateLimit(clientId: string): Promise<void>`

### Interfaz RateLimitResult

```typescript
interface RateLimitResult {
  allowed: boolean;
  remainingRequests?: number;
  resetTime?: number;
  retryAfter?: number;
}
```

## Identificación de Cliente

```typescript
private getClientIdentifier(req: Request): string {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  return `${ip}:${userAgent}`;
}
```

## Ventajas sobre Implementación Anterior

1. **Performance**: Redis es mucho más rápido que PostgreSQL para este tipo de operaciones
2. **Escalabilidad**: Múltiples instancias de backend pueden compartir el mismo Redis
3. **Precisión**: Sliding window vs fixed window más preciso
4. **Memoria**: TTL automático vs limpieza manual en DB
5. **Monitoring**: Headers estándar y métricas de Redis

## Fallback Strategy

Si Redis no está disponible, el sistema permite el request (graceful degradation):

```typescript
catch (error) {
  console.error('Rate limiter error:', error);
  return {
    allowed: true,
    remainingRequests: this.maxRequests - 1,
  };
}
```

## Testing

### Pruebas Manuales

```bash
# Múltiples requests para probar rate limiting
curl -X POST http://localhost:3001/purchase \
  -H "Content-Type: application/json" \
  -d '{"userId": "test-user"}'
```

### Verificar Redis

```bash
# Conectar a Redis CLI
redis-cli

# Ver keys de rate limiting
KEYS rate_limit:*

# Ver contenido de un key
ZRANGE rate_limit:127.0.0.1:curl/8.0.0 0 -1 WITHSCORES
```

## Monitoreo

### Métricas Clave

- Requests rechazados por rate limiting
- Latencia de Redis operations  
- Uso de memoria en Redis
- Distribución de requests por cliente

### Logs

- Conexión/desconexión de Redis
- Errores de Redis operations
- Rate limit violations (opcional)

## Troubleshooting

### Redis Connection Issues

1. Verificar que Redis esté corriendo
2. Revisar configuración de red/firewall
3. Validar credenciales en .env
4. Revisar logs de conexión

### Rate Limiting No Funciona

1. Verificar middleware está aplicado
2. Revisar configuración de ventana y límites
3. Confirmar que Redis keys se están creando
4. Validar identificación de cliente

## Próximos Pasos

1. **Métricas**: Implementar Prometheus metrics
2. **Dashboard**: Redis monitoring con Grafana
3. **Configuración Dinámica**: Rate limits por usuario/endpoint
4. **Geolocalización**: Rate limits diferentes por región
5. **Circuit Breaker**: Protección adicional contra ataques
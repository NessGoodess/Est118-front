# Capas de infraestructura en `lib`

## Estructura

```
lib/
  api/         Cliente HTTP (Axios + Sanctum)
    env.ts
    client.ts
    endpoints.ts
    csrf.ts
    interceptors.ts
    errors.ts
    urls.ts
    index.ts

  auth/        Sesión SPA + eventos de auth
    session.ts
    events.ts
    event-bus.ts
    index.ts

  realtime/    Laravel Echo / Reverb
    echo.ts
    index.ts

  services/    Casos de uso por dominio (usan @/lib/api)
  types/
  validations/
```

## Imports canónicos

```ts
import apiClient, { API_ENDPOINTS, handleApiError } from '@/lib/api';
import { login, logout, getCurrentUser, authEventBus, AuthEvent } from '@/lib/auth';
import { getEcho, disconnectEcho } from '@/lib/realtime';
```

## Variables de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_PATH=/api
NEXT_PUBLIC_APP_ENV=development
```

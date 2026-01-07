# Arquitectura de Autenticación

## Estructura

### `api.ts`
Configuración centralizada de Axios para comunicación con Laravel Sanctum.
- Maneja automáticamente cookies HTTP-only
- Gestiona tokens XSRF
- Interceptores para manejo de errores
- Retry automático con CSRF cookie en caso de 401

### `auth.ts`
Funciones de autenticación:
- `getCsrfCookie()` - Obtiene cookie CSRF
- `login(credentials)` - Inicia sesión
- `logout()` - Cierra sesión
- `getCurrentUser()` - Obtiene usuario actual
- `checkAuth()` - Verifica autenticación
- `formatAuthError(error)` - Formatea errores para mostrar al usuario

### `types.ts`
Tipos TypeScript para toda la aplicación:
- `User` - Tipo de usuario
- `LoginCredentials` - Credenciales de login
- `ApiResponse<T>` - Respuesta genérica de API
- `ApiError` - Errores de API

## Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_BASE_PATH=/api
NEXT_PUBLIC_APP_ENV=development
```

**Nota sobre `NEXT_PUBLIC_APP_ENV`:**
- Controla el modo de desarrollo/producción
- Cuando es `development`, se activa el logging de solicitudes HTTP en la consola
- Valores posibles: `development`, `production`, `staging`
- Si no se define, por defecto es `development`

## Uso

### Hook useAuth

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, loading, authenticated, login, logout, error } = useAuth();
  
  // ...
}
```

### Funciones directas

```tsx
import { login, logout, getCurrentUser } from '@/lib/auth';

// Login
await login({ email: 'user@example.com', password: 'password' });

// Logout
await logout();

// Obtener usuario
const user = await getCurrentUser();
```

## Middleware

El middleware en `middleware.ts` protege automáticamente las rutas definidas en `protectedRoutes`.
Las rutas protegidas requieren cookie de sesión válida.


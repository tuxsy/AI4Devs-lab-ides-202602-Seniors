## Why

Para el MVP necesitamos una forma simple de autenticar usuarios sin implementar un sistema completo de autenticación. Esto permite avanzar con el desarrollo del dashboard y la visualización de datos del usuario mientras se define el sistema de autenticación definitivo.

## What Changes

- Nuevo endpoint `/autologin` en el backend que devuelve datos de usuario mock (ID, email, nombre)
- Nueva página de dashboard en el frontend que:
  - Invoca automáticamente el endpoint de autologin al cargar
  - Muestra los datos del usuario (nombre y email)
  - Lista los candidatos del usuario
- El endpoint solo estará disponible en entorno MVP/desarrollo

## Capabilities

### New Capabilities

- `autologin-endpoint`: Endpoint temporal para autenticación automática en MVP, devuelve datos de usuario hardcodeados
- `user-dashboard`: Página inicial del frontend que muestra información del usuario y listado de sus candidatos

### Modified Capabilities

## Impact

- **Backend**: Nuevo endpoint en `/autologin`, nuevo router y controller
- **Frontend**: Nueva página Dashboard como página principal, nuevo servicio para consumir autologin
- **APIs**: Consumo del endpoint existente de candidatos para mostrar listado
- **Swagger**: Documentación del nuevo endpoint de autologin

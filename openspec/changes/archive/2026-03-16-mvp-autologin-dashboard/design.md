## Context

El sistema LTI ATS actualmente tiene un backend Express con endpoints para candidatos y documentos, y un frontend React básico. No existe sistema de autenticación. Para el MVP necesitamos simular un usuario autenticado para poder desarrollar funcionalidades que dependan del contexto de usuario.

La estructura actual del backend sigue el patrón routes → controllers → services → repositories. El frontend usa CRA con TypeScript.

## Goals / Non-Goals

**Goals:**
- Endpoint `/autologin` que devuelve datos de usuario mock para desarrollo
- Dashboard como página principal del frontend
- Integración con endpoint existente de candidatos
- Documentación en Swagger UI

**Non-Goals:**
- Sistema de autenticación real (login/password, JWT, sessions)
- Persistencia de usuarios en base de datos
- Protección de rutas basada en roles
- Gestión de múltiples usuarios

## Decisions

### 1. Endpoint GET /autologin

**Decisión**: Crear endpoint que consulta la base de datos y devuelve el primer usuario ordenado por UUID.

**Algoritmo de selección**:
1. Consultar todos los usuarios de la base de datos
2. Ordenar por UUID ascendente
3. Devolver el primero

**Alternativas consideradas**:
- Datos hardcodeados → No garantiza consistencia con datos reales
- Query param para simular diferentes usuarios → Complejidad innecesaria para MVP
- Leer de archivo JSON → Overhead sin beneficio real

**Implementación**:
- Router: `src/routes/autologin.ts`
- Query: `prisma.user.findFirst({ orderBy: { id: 'asc' } })`
- Respuesta: `{ id, email, name }`
- Documentado con JSDoc para Swagger

### 2. Estructura del Dashboard

**Decisión**: Componente único `Dashboard.tsx` que orquesta la carga de datos.

**Flujo**:
1. Al montar, llama a `/autologin`
2. Con el userId obtenido, llama a `/candidates?userId=<id>`
3. Renderiza datos de usuario y tabla de candidatos

**Alternativas consideradas**:
- Context global para usuario → Overkill para MVP
- Múltiples páginas con routing → Fuera de scope

### 3. Servicio de API en Frontend

**Decisión**: Crear `services/api.ts` con funciones para autologin y candidatos.

Usa fetch nativo, centraliza la baseURL del backend.

### 4. Material UI para componentes

**Decisión**: Usar MUI para Card (datos usuario) y Table (candidatos).

Consistente con la dirección del proyecto (mencionado en AGENTS.md).

## Risks / Trade-offs

- **[Seguridad]** Endpoint sin protección → Mitigación: Solo para MVP/desarrollo, documentar claramente
- **[Mantenibilidad]** Código temporal que deberá removerse → Mitigación: Marcar con comentarios TODO y aislar en archivos dedicados
- **[Base de datos vacía]** Si no hay usuarios, el endpoint falla → Mitigación: Retornar 404 con mensaje claro, asegurar seed de datos

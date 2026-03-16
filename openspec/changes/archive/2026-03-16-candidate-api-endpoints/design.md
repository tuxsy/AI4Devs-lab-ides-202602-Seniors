## Context

El backend del sistema ATS (Express + Prisma + PostgreSQL) tiene los modelos de datos definidos pero carece de endpoints REST para gestionar candidatos. La historia de usuario requiere que los reclutadores puedan añadir candidatos con su información completa (datos personales, educación, experiencia laboral) y subir documentos (CV).

**Estado actual:**
- Modelos Prisma existentes: `Candidate`, `Education`, `WorkExperience`, `Document`
- Express configurado con Helmet y CORS
- Error handler centralizado implementado
- No existen: controllers, services, repositories, validación, ni rutas de candidatos

**Restricciones (definidas en `docs/backend-security.md`):**
- Validación server-side obligatoria con Zod
- Rate limiting en endpoints de escritura (30 req/15min)
- Archivos: solo PDF/DOCX, max 5MB, UUID naming, esquema URI `fs://`
- No exponer PII en logs ni errores

## Goals / Non-Goals

**Goals:**
- Implementar CRUD parcial de candidatos (Create, Read, List)
- Permitir subida de documentos asociados a candidatos
- Establecer arquitectura por capas (routes → controllers → services → repositories)
- Cumplir requisitos de seguridad definidos en backend-security.md

**Non-Goals:**
- Update/Delete de candidatos (fuera del alcance de esta historia)
- Autenticación/autorización (se asume caller verificado)
- Descarga de documentos (solo subida)
- Búsqueda avanzada o full-text search
- Migración a MinIO (se usa filesystem local con esquema URI preparado)

## Decisions

### 1. Arquitectura por capas

**Decisión:** Implementar patrón routes → controllers → services → repositories.

**Alternativas consideradas:**
- Routes directas a Prisma: Más simple pero no escalable, difícil de testear
- Controllers con lógica inline: Mezcla responsabilidades

**Rationale:** Separación de concerns permite testing unitario de cada capa y facilita cambios futuros (e.g., cambiar ORM).

```
routes/candidates.ts     → Define endpoints HTTP, aplica middleware
controllers/candidate.ts → Parsea request/response, delega a service
services/candidate.ts    → Lógica de negocio, validación, transacciones
repositories/candidate.ts → Acceso a datos via Prisma
```

### 2. Validación con Zod

**Decisión:** Usar Zod para definir y validar schemas de entrada.

**Alternativas consideradas:**
- express-validator: Más verboso, menos type-safe
- Joi: Similar a Zod pero sin inferencia de tipos
- class-validator: Requiere decoradores y clases

**Rationale:** Zod permite inferir tipos TypeScript del schema, reduciendo duplicación. Soporta `.strip()` para eliminar campos desconocidos y transformaciones (sanitización HTML).

### 3. Transacción para creación de candidato

**Decisión:** Usar `prisma.$transaction` para crear candidato con educación y experiencia en una operación atómica.

**Alternativas consideradas:**
- Crear en secuencia sin transacción: Riesgo de datos huérfanos si falla
- Nested writes de Prisma: Viable, pero transacción explícita es más clara

**Rationale:** Si falla la creación de cualquier registro relacionado, se hace rollback completo.

### 4. Estructura de respuesta paginada

**Decisión:** Respuesta con estructura `{ data: [], pagination: { total, page, limit, totalPages } }`.

**Alternativas consideradas:**
- Solo array: Simple pero pierde metadata de paginación
- Cursor-based pagination: Más complejo, no necesario para MVP
- Link headers (RFC 5988): Menos amigable para clientes JS

**Rationale:** Offset-based pagination es suficiente para el volumen esperado y más simple de implementar.

### 5. Manejo de archivos con Multer

**Decisión:** Configurar Multer con `diskStorage`, UUID naming, y validación de MIME/extensión.

**Alternativas consideradas:**
- Memory storage: Riesgo de OOM con archivos grandes
- Streaming a S3/MinIO: Más complejo, no necesario para MVP

**Rationale:** Almacenamiento local con esquema URI `fs://` permite migración futura a object storage sin cambiar el modelo de datos.

### 6. Rate limiting por IP

**Decisión:** Usar `express-rate-limit` con 30 requests/15min en endpoints POST.

**Alternativas consideradas:**
- Rate limit global: Afecta lectura innecesariamente
- Redis-backed rate limiting: Más robusto pero añade dependencia

**Rationale:** Rate limiting en memoria es suficiente para MVP single-instance. El límite aplica solo a escritura para no afectar UX de consulta.

### 7. Sanitización HTML

**Decisión:** Usar regex simple para strip HTML tags en campos de texto.

**Alternativas consideradas:**
- DOMPurify: Overkill para strip simple, añade dependencia
- sanitize-html: Más features de las necesarias

**Rationale:** Solo necesitamos eliminar tags, no sanitizar HTML complejo. Regex `/(<([^>]+)>)/gi` es suficiente.

### 8. Esquema de URI para documentos

**Decisión:** Almacenar `fileUri` como `fs://uploads/<uuid>.<ext>`.

**Alternativas consideradas:**
- Path absoluto: Acoplado al servidor
- Path relativo simple: Ambiguo sobre el storage backend

**Rationale:** El esquema URI permite identificar el backend de almacenamiento y facilita migración futura a `minio://` o `s3://`.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| Rate limiting en memoria no persiste entre reinicios | Aceptable para MVP; documentar para migrar a Redis en producción |
| UUID v4 tiene probabilidad remota de colisión | Probabilidad negligible (1 en 2^122); aceptable |
| Archivos grandes bloquean el event loop durante escritura | Multer usa streams; archivos max 5MB son manejables |
| Paginación offset-based ineficiente con datasets grandes | Aceptable para MVP; considerar cursor-based si supera 100K registros |
| Validación de MIME type puede ser spoofed | Combinamos MIME + extensión; para MVP es suficiente. Magic bytes validation sería más robusto |

## Open Questions

1. **userId en creación de candidato**: Actualmente se asume que el caller pasa `userId` en el body. ¿Debería extraerse de un header o token JWT cuando se implemente auth?

Sí, más adelante este parámetro lo extraeremos de un JWT, de momento déjalo como está. Estaría bien que cada vez que se procese un endpoint que tenga el `userId` en el body aparezca un WARNING en la consola del servidor (backend) avisando que es necesario implementar la seguridad vía JWT.

2. **Soft delete**: El modelo no tiene `deletedAt`. ¿Se implementará en una historia futura?

Lo implementaremos en una historia de usuario futura.

3. **Límite de documentos por candidato**: No hay restricción actual. ¿Debería limitarse (e.g., max 10 documentos)?

Añade un límite de 10 documentos.

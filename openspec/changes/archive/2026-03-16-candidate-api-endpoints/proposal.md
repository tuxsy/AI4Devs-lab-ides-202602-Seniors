## Why

El sistema ATS necesita endpoints REST para que los reclutadores puedan añadir y consultar candidatos en el sistema. Actualmente el backend tiene los modelos Prisma definidos (Candidate, Education, WorkExperience, Document) pero no existen rutas ni lógica de negocio para gestionar candidatos. Esta funcionalidad es crítica para la historia de usuario principal: permitir a los reclutadores capturar información de candidatos incluyendo datos personales, formación académica, experiencia laboral y documentos (CV), así como consultar la lista de candidatos y ver el detalle de cada uno.

## What Changes

- **Nuevo endpoint GET /candidates**: Listar candidatos con soporte para paginación y filtros básicos.
- **Nuevo endpoint GET /candidates/:id**: Obtener detalle completo de un candidato incluyendo educación, experiencia laboral y documentos.
- **Nuevo endpoint POST /candidates**: Crear un candidato con todos sus datos relacionados (educación, experiencia laboral) en una única transacción.
- **Nuevo endpoint POST /candidates/:id/documents**: Subir documentos (CV en PDF/DOCX) asociados a un candidato existente.
- **Validación server-side con Zod**: Esquemas de validación estrictos para todos los campos según las reglas de seguridad definidas.
- **Middleware de rate limiting**: Protección contra abuso en endpoints de creación y subida de archivos (30 req/15min por IP).
- **Manejo de archivos con Multer**: Configuración segura para subida de CV (max 5MB, UUID naming, validación MIME).
- **Arquitectura por capas**: Implementación de controllers, services y repositories siguiendo el patrón definido en AGENTS.md.

## Capabilities

### New Capabilities

- `candidate-management`: Gestión completa de candidatos: listar con paginación/filtros, obtener detalle individual, y crear candidatos con datos personales, educación y experiencia laboral. Incluye validación Zod, manejo de errores estructurado y respuestas consistentes.
- `document-upload`: Subir documentos (CV) asociados a candidatos. Validación de tipo MIME, tamaño máximo 5MB, almacenamiento seguro con UUID y esquema de URI abstracto (`fs://`).

### Modified Capabilities

_(No hay capacidades existentes que modifiquen requisitos a nivel de spec)_

## Impact

### Código afectado

| Área | Cambios |
|------|---------|
| `backend/src/routes/` | Nuevo `candidates.ts` con rutas GET y POST |
| `backend/src/controllers/` | Nuevo directorio con `candidateController.ts` |
| `backend/src/services/` | Nuevo directorio con `candidateService.ts` |
| `backend/src/repositories/` | Nuevo directorio con `candidateRepository.ts` |
| `backend/src/middleware/` | Nuevo directorio con `validation.ts`, `upload.ts`, `rateLimit.ts` |
| `backend/src/types/` | Nuevo directorio con schemas Zod y tipos TypeScript |
| `backend/src/index.ts` | Registro de nuevas rutas y middlewares |

### Dependencias nuevas

| Paquete | Propósito |
|---------|-----------|
| `zod` | Validación de esquemas |
| `multer` | Manejo de uploads multipart |
| `uuid` | Generación de nombres únicos para archivos |
| `express-rate-limit` | Rate limiting por IP |

### APIs

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/candidates` | Listar candidatos con paginación y filtros |
| GET | `/candidates/:id` | Obtener detalle completo de un candidato |
| POST | `/candidates` | Crear candidato con educación y experiencia |
| POST | `/candidates/:id/documents` | Subir documento asociado a candidato |

### Base de datos

No hay cambios en el esquema Prisma. Los modelos `Candidate`, `Education`, `WorkExperience` y `Document` ya existen y cumplen los requisitos.

## 1. Setup y Dependencias

- [x] 1.1 Instalar dependencias: zod, multer, uuid, express-rate-limit y sus tipos
- [x] 1.2 Crear estructura de directorios: controllers/, services/, repositories/, middleware/, types/
- [x] 1.3 Crear directorio uploads/ y añadirlo a .gitignore
- [x] 1.4 Añadir UPLOAD_DIR a .env.example

## 2. Types y Schemas Zod

- [x] 2.1 Crear types/candidate.ts con schemas Zod para CreateCandidate, Education, WorkExperience
- [x] 2.2 Implementar transformación para sanitizar HTML en campos de texto (regex strip tags)
- [x] 2.3 Crear types/document.ts con schema Zod para DocumentType enum
- [x] 2.4 Crear types/pagination.ts con schema para query params de paginación
- [x] 2.5 Exportar tipos TypeScript inferidos de los schemas Zod

## 3. Repository Layer

- [x] 3.1 Crear repositories/candidateRepository.ts con método findAll (paginado, filtro status)
- [x] 3.2 Añadir método findById con includes (education, workExperience, documents)
- [x] 3.3 Añadir método create con transacción para candidato + educación + experiencia
- [x] 3.4 Añadir método countDocuments para verificar límite de 10 documentos por candidato
- [x] 3.5 Crear repositories/documentRepository.ts con método create

## 4. Service Layer

- [x] 4.1 Crear services/candidateService.ts con método list (paginación, filtros)
- [x] 4.2 Añadir método getById con manejo de not found
- [x] 4.3 Añadir método create con validación de email único (manejar P2002 → 409)
- [x] 4.4 Añadir WARNING console.log cuando se reciba userId en body (recordatorio JWT)
- [x] 4.5 Crear services/documentService.ts con método upload
- [x] 4.6 Implementar validación de límite de 10 documentos por candidato

## 5. Middleware

- [x] 5.1 Crear middleware/validation.ts con función validateBody que usa schema Zod
- [x] 5.2 Crear middleware/validateUuid.ts para validar formato UUID en params
- [x] 5.3 Crear middleware/rateLimit.ts con configuración 30 req/15min
- [x] 5.4 Crear middleware/upload.ts con Multer config (diskStorage, UUID naming, 5MB limit)
- [x] 5.5 Implementar fileFilter en Multer para validar MIME y extensión (PDF/DOCX)

## 6. Controller Layer

- [x] 6.1 Crear controllers/candidateController.ts con handler listCandidates
- [x] 6.2 Añadir handler getCandidateById
- [x] 6.3 Añadir handler createCandidate
- [x] 6.4 Crear controllers/documentController.ts con handler uploadDocument

## 7. Routes

- [x] 7.1 Crear routes/candidates.ts con GET / (list) y GET /:id (detail)
- [x] 7.2 Añadir POST / con middleware de validación y rate limiting
- [x] 7.3 Añadir POST /:id/documents con middleware de upload y rate limiting
- [x] 7.4 Registrar router en index.ts bajo /candidates

## 8. Error Handling

- [x] 8.1 Crear clase ApiError con statusCode en types/errors.ts
- [x] 8.2 Actualizar error handler en index.ts para manejar errores Zod (400)
- [x] 8.3 Manejar MulterError para file size exceeded (400)
- [x] 8.4 Manejar PrismaClientKnownRequestError P2002 para email duplicado (409)

## 9. Tests

- [x] 9.1 Crear tests/candidates.test.ts con tests para GET /candidates (paginación, filtros)
- [x] 9.2 Añadir tests para GET /candidates/:id (found, not found, invalid UUID)
- [x] 9.3 Añadir tests para POST /candidates (success, validation errors, duplicate email)
- [x] 9.4 Crear tests/documents.test.ts con tests para POST /candidates/:id/documents
- [x] 9.5 Añadir tests para validación de file type y size limit

## 10. Documentación

- [x] 10.1 Añadir anotaciones Swagger/OpenAPI a los endpoints en routes/candidates.ts
- [x] 10.2 Verificar que Swagger UI muestra los nuevos endpoints en /api-docs.
- [x] 10.3 Usa el mcp de playwright para testear que los endpoints funcinonen usando la Swagger UI.

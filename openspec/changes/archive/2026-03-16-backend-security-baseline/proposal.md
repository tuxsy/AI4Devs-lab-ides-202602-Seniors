## Why

The Express backend is currently a bare app with no security middleware — no helmet, no CORS, no structured error handling, and no body parsing. These horizontal concerns must be in place before any feature endpoint is built, as they apply globally to the entire API surface.

## What Changes

- Install and configure `helmet` (HTTP security headers, clickjacking protection)
- Install and configure `cors` with an explicit origin allowlist via env var (`ALLOWED_ORIGIN`)
- Replace the current broken error handler with a centralized JSON error middleware
- Add `express.json()` body parser
- Add `.env` scaffolding (`ALLOWED_ORIGIN`, `DATABASE_URL`)

## Capabilities

### New Capabilities

- `http-security-headers`: Helmet middleware enforcing secure HTTP response headers
- `cors-policy`: CORS configuration restricting origins to an allowlist from env
- `error-handling`: Centralized Express error handler returning structured JSON, no stack traces exposed
- `body-parsing`: express.json() middleware enabling JSON request bodies

### Modified Capabilities

## Impact

- `backend/src/index.ts`: All changes are confined to this file (middleware registration order matters)
- `backend/package.json`: New runtime dependencies — `helmet`, `cors`, `@types/cors`
- `backend/.env` / `backend/.env.example`: New env vars `ALLOWED_ORIGIN`
- No database changes, no new routes, no Prisma changes

## Context

`backend/src/index.ts` is a bare Express app (~28 lines): no security headers, no CORS, no body parser, a broken error handler (responds with text/plain, exposes `err.stack`). The app has `dotenv` and Prisma already wired. No feature endpoints exist yet — this is the right moment to establish the security baseline before any route is added.

Runtime dependencies `helmet`, `cors`, and `@types/cors` are not yet installed.

## Goals / Non-Goals

**Goals:**
- Add `helmet` as the first middleware (HTTP security headers + anti-clickjacking)
- Add `cors` restricted to `process.env.ALLOWED_ORIGIN`
- Add `express.json()` body parser
- Replace the broken error handler with a centralized one: JSON responses, no stack traces, correct status codes
- Scaffold `backend/.env.example` with `ALLOWED_ORIGIN` and `DATABASE_URL`

**Non-Goals:**
- Auth / rate limiting / input validation (vertical, tied to specific routes)
- Any new routes or Prisma schema changes
- Frontend changes

## Decisions

**Middleware order in `index.ts`**

Order matters in Express. The final order will be:
```
helmet()           ← security headers on every response
cors(...)          ← CORS preflight handled before any route
express.json()     ← body parsing
[routes]           ← feature routes (none yet)
[error handler]    ← must be last, 4-arg signature
```

**CORS: single origin string vs. array**

`ALLOWED_ORIGIN` will be a single string (e.g. `http://localhost:3000`). Multi-origin support is deferred — not needed for MVP with one frontend.

**Error handler shape**

Follows `docs/backend-security.md`:
```json
{ "error": "<type>", "message": "<user-safe message>" }
```
- `400` for validation errors (detected by `err.statusCode === 400` or custom flag)
- `500` for everything else
- Stack traces logged via `console.error` server-side only, never sent to client

**No `ApiError` class in this change**

A custom `ApiError` class would be useful, but it's a vertical concern — it pairs with route/controller error throwing. This change only installs the handler that can receive both plain `Error` and future `ApiError` instances. The handler will check for a `statusCode` property duck-typed.

## Risks / Trade-offs

- `ALLOWED_ORIGIN` undefined at runtime → CORS will reject all cross-origin requests. Mitigation: `.env.example` documents the required var; startup can log a warning.
- `helmet` defaults may break Swagger UI (e.g. `contentSecurityPolicy`). Mitigation: disable or configure CSP for `/api-docs` route if needed (low risk for dev-only MVP).

## Open Questions

- Should `express.json()` have a `limit`? (e.g. `'1mb'`). Recommended yes — add `{ limit: '1mb' }` to prevent oversized JSON bodies even before multer handles files.

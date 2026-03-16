## 1. Install dependencies

- [x] 1.1 Install runtime dependencies: `npm install helmet cors` (from `backend/`)
- [x] 1.2 Install type definitions: `npm install --save-dev @types/cors` (from `backend/`)

## 2. Configure middleware in index.ts

- [x] 2.1 Import `helmet` and add `app.use(helmet({ frameguard: { action: 'deny' } }))` as the first middleware
- [x] 2.2 Import `cors` and add `app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }))` after helmet
- [x] 2.3 Add `app.use(express.json({ limit: '1mb' }))` after cors

## 3. Replace error handler

- [x] 3.1 Remove the existing broken error handler (text/plain, exposes `err.stack` in response)
- [x] 3.2 Add a centralized 4-arg error handler as the last middleware, returning `{ error, message }` JSON with correct status codes (400 / 500), logging stack via `console.error` server-side only

## 4. Environment scaffolding

- [x] 4.1 Add `ALLOWED_ORIGIN=http://localhost:3000` to `backend/.env` (if it exists) or confirm it's documented
- [x] 4.2 Create or update `backend/.env.example` with `ALLOWED_ORIGIN=` and `DATABASE_URL=` entries

## 5. Verification

- [x] 5.1 Run `npm run build` from `backend/` — zero TypeScript errors
- [x] 5.2 Run `npm test` from `backend/` — all existing tests pass
- [x] 5.3 Start the dev server (`npm run dev`) and confirm `helmet` headers appear in a `curl -I http://localhost:3010/` response

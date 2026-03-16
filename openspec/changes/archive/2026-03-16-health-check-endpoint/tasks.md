## 1. Route file

- [x] 1.1 Create `backend/src/routes/health.ts` with an Express Router exporting a `GET /` handler
- [x] 1.2 Inside the handler, run `prisma.$queryRaw\`SELECT 1\`` to check DB reachability; catch any error and set `db.status = 'unreachable'`
- [x] 1.3 Return `200` with `{ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString(), db: { status: 'ok' } }` when DB is reachable
- [x] 1.4 Return `503` with `{ status: 'degraded', uptime: process.uptime(), timestamp: new Date().toISOString(), db: { status: 'unreachable' } }` when DB is not reachable

## 2. Wire into app

- [x] 2.1 Import the health router in `backend/src/index.ts` and mount it at `app.use('/health', healthRouter)` — before the error handler, after body parser

## 3. Tests

- [x] 3.1 Create `backend/src/tests/health.test.ts` using `supertest`
- [x] 3.2 Write test: `GET /health` returns `200` and `{ status: 'ok' }` shape when Prisma responds (mock `$queryRaw`)
- [x] 3.3 Write test: `GET /health` returns `503` and `{ status: 'degraded' }` when Prisma throws (mock `$queryRaw` to reject)
- [x] 3.4 Write test: response `Content-Type` is `application/json`

## 4. Verification

- [x] 4.1 Run `npm run build` from `backend/` — zero TypeScript errors
- [x] 4.2 Run `npm test` from `backend/` — all tests pass including new health tests
- [x] 4.3 With the dev server running and DB up, confirm `curl http://localhost:3010/health` returns `200` with `status: ok`

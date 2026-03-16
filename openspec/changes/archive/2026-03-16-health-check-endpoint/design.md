## Context

The `backend-security-baseline` change will wire helmet, cors, body parser and a proper error handler into `index.ts`. Once that lands, the only existing route is `GET /` which returns the string `"Hola LTI!"` — not useful for verifying infrastructure. A structured health endpoint closes that gap.

The Prisma client is already instantiated as a singleton in `index.ts` and exported. The backend has no dedicated `routes/` directory yet — this endpoint can either live in `index.ts` (acceptable for MVP, one route) or bootstrap the `routes/` pattern (better for long-term).

## Goals / Non-Goals

**Goals:**
- `GET /health` returns `200` with structured JSON when the server is up and the DB is reachable
- `GET /health` returns `503` with structured JSON when the DB is unreachable
- Response includes: `status`, `uptime` (seconds), `timestamp`, `db` sub-object with reachability status
- Route is placed in `backend/src/routes/health.ts` to establish the routes pattern early

**Non-Goals:**
- Auth / rate limiting on this endpoint (public by design, returns no sensitive data)
- Checking external services beyond Prisma/PostgreSQL
- Metrics aggregation or time-series data

## Decisions

**DB check: `$queryRaw` SELECT 1 vs. `$connect`**

Use `prisma.$queryRaw\`SELECT 1\`` — it is a real round-trip that exercises the connection pool. `$connect()` only ensures a connection exists but does not exercise a query. `SELECT 1` fails fast if the DB is genuinely down.

**Response shape on DB failure: 503 not 500**

`503 Service Unavailable` is semantically correct for a dependency being down (vs. `500` which implies an unhandled crash). Load balancers and health probes understand 503.

**Route file vs. inline in index.ts**

Extract to `backend/src/routes/health.ts`. The project structure in `AGENTS.md` already mandates a `routes/` directory. One inline route in `index.ts` today means five inline routes tomorrow — better to start clean.

**Response format**

```json
{
  "status": "ok" | "degraded",
  "uptime": 42.3,
  "timestamp": "2026-03-16T10:00:00.000Z",
  "db": { "status": "ok" | "unreachable" }
}
```

`"degraded"` (not `"error"`) — the server is still responding, just the DB is down. Keeps the shape consistent with standard health check conventions.

## Risks / Trade-offs

- [DB check adds latency to every health probe] → Acceptable for MVP; health probes run infrequently. If it becomes a problem, add a cached check later.
- [Exposing uptime could be useful to attackers] → Uptime is low-sensitivity metadata; not a meaningful attack surface for an internal ATS MVP.

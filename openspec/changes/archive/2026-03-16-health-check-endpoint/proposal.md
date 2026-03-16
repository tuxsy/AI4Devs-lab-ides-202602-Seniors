## Why

After applying the `backend-security-baseline` change (helmet, cors, error handler, body parser), there is no way to verify that the app is running correctly and that all infrastructure concerns are wired up as expected. A health check endpoint provides a fast, observable signal that the server is alive and operational — useful during development, CI, and eventual deployment.

## What Changes

- Add a `GET /health` endpoint to the Express app
- The endpoint returns the server status, uptime, and a database connectivity check (Prisma ping)
- No auth required — the endpoint is intentionally public and returns no sensitive data

## Capabilities

### New Capabilities

- `health-check`: A `GET /health` endpoint that reports server liveness and database reachability, returning a structured JSON response with status and metadata

### Modified Capabilities

## Impact

- `backend/src/index.ts` or a new `backend/src/routes/health.ts`: one new route added
- No new npm dependencies required
- No Prisma schema changes
- No frontend changes

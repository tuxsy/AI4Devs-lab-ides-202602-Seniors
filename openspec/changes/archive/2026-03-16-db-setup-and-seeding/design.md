## Context

The backend has a stub Prisma schema with only a `User` model using integer auto-increment IDs, which conflicts with the data model specification that mandates UUIDs. No migrations have been run. The PostgreSQL instance is available via Docker Compose. All downstream features (candidate management API, file upload, frontend) depend on the database schema being correct and populated with test data.

## Goals / Non-Goals

**Goals:**
- Complete the Prisma schema to exactly match `docs/data-model.md` (all models, enums, relations, field types, and constraints)
- Use UUIDs as primary keys for all entities, consistent with the data model spec
- Generate and apply a single initial migration that creates all tables from scratch
- Provide a seed script with realistic synthetic data (2 recruiters, 5–8 candidates each with education and work experience records, and at least one document reference per candidate)

**Non-Goals:**
- File storage implementation (seed data uses `fs://` URIs as placeholders — actual file upload is task-05)
- Authentication or authorization (task-05)
- Additional migrations beyond the initial schema creation
- Production data or migration tooling

## Decisions

### 1. UUID primary keys via `@default(uuid())`

**Decision**: Use `String @id @default(uuid())` for all models instead of `Int @id @default(autoincrement())`.

**Rationale**: The data model spec explicitly requires UUIDs for security (safe in public URLs/APIs) and consistency across all entities. PostgreSQL supports UUIDs natively; Prisma generates them client-side via `uuid()` which works without the `uuid-ossp` extension.

**Alternative considered**: Keep integer IDs for simplicity — rejected because it contradicts the spec and would require a second migration later.

### 2. Single initial migration (`0001_init`)

**Decision**: Drop the current empty schema and create one consolidated migration that provisions all tables.

**Rationale**: No production data exists; the database is dev-only. A single clean migration is simpler than an additive migration on top of the stub schema, which would produce confusing migration history.

**Alternative considered**: Additive migration preserving the existing `User` table — rejected because the PK type change (int → uuid) is a breaking change regardless, and no data needs preserving.

### 3. Seed script in TypeScript (`prisma/seed.ts`)

**Decision**: Write the seed script in TypeScript using the Prisma client directly, configured via `"prisma": { "seed": "ts-node prisma/seed.ts" }` in `package.json`.

**Rationale**: Consistent with the backend TypeScript codebase, type-safe, and the standard Prisma seeding pattern. `ts-node` is already a dev dependency via `ts-node-dev`.

**Alternative considered**: Plain JS seed script — rejected for consistency and type safety.

### 4. Idempotent seed via `deleteMany` + `createMany`

**Decision**: The seed script begins by deleting all records in reverse dependency order (Documents → WorkExperience → Education → Candidate → User), then re-inserts.

**Rationale**: Allows `npx prisma db seed` to be run multiple times in development without duplicate key errors.

## Risks / Trade-offs

- **UUID generation performance** → Negligible at this scale; UUIDs are generated client-side by Prisma, no extension required.
- **Migration destructiveness** → The initial migration drops and recreates all tables. Any existing dev data is lost. Mitigation: dev environment only; document in README that `prisma migrate reset` is acceptable.
- **`ts-node` cold start in seed** → Seed script has a small startup overhead vs plain JS. Acceptable for a dev-only script.
- **`endDate: null` for ongoing records** → Seed data includes both completed and in-progress education/work entries to exercise nullable date logic in queries.

## Migration Plan

1. Ensure PostgreSQL container is running: `docker compose up -d`
2. Apply schema + migration: `npx prisma migrate dev --name init` (from `backend/`)
3. Run seed: `npx prisma db seed` (from `backend/`)
4. Verify via Prisma Studio: `npx prisma studio`

**Rollback**: `npx prisma migrate reset` drops and recreates the database.

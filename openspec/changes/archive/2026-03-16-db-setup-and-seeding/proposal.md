## Why

The backend currently has an incomplete Prisma schema (`User` model only) with no database migrations or seed data. The ATS cannot function — no candidates, education records, work experience, or documents can be persisted. This change completes the data layer so all subsequent features have a working database to build on.

## What Changes

- Complete the Prisma schema with all models defined in `docs/data-model.md`: `Candidate`, `Education`, `WorkExperience`, `Document`, and supporting enums (`CandidateStatus`, `DocumentType`)
- Update the `User` model to use UUID primary keys (aligning with the data model spec)
- Create the initial database migration to provision all tables in PostgreSQL
- Create a seed script that inserts realistic synthetic data (users, candidates with education, work experience, and documents)

## Capabilities

### New Capabilities

- `db-schema`: Full Prisma schema covering all ATS entities (User, Candidate, Education, WorkExperience, Document) with correct types, constraints, and relations
- `db-seed`: Seed script that populates the database with synthetic test data for local development

### Modified Capabilities

<!-- None — the existing User model is being corrected to match the spec (UUID PK), not changing existing behavior -->

## Impact

- `backend/prisma/schema.prisma`: Replaced with complete schema
- `backend/prisma/migrations/`: New initial migration SQL generated
- `backend/prisma/seed.ts` (new): Seed script
- `backend/package.json`: Add `prisma.seed` configuration entry
- Downstream tasks (task-04, task-05) depend on this data layer being in place

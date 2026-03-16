## 1. Prisma Schema

- [x] 1.1 Update `backend/prisma/schema.prisma`: add `CandidateStatus` enum with values `ACTIVE`, `IN_PROCESS`, `HIRED`, `REJECTED`, `WITHDRAWN`
- [x] 1.2 Update `backend/prisma/schema.prisma`: add `DocumentType` enum with values `CV`, `COVER_LETTER`, `OTHER`
- [x] 1.3 Update `User` model: change `id` from `Int @default(autoincrement())` to `String @id @default(uuid())`, add `candidates` relation field
- [x] 1.4 Add `Candidate` model with all fields from the data model spec (UUID PK, userId FK, firstName, lastName, email unique, phone?, address?, status enum, createdAt, updatedAt, relations to Education/WorkExperience/Document)
- [x] 1.5 Add `Education` model with all fields (UUID PK, candidateId FK, institution, degree, fieldOfStudy?, startDate, endDate?, createdAt)
- [x] 1.6 Add `WorkExperience` model with all fields (UUID PK, candidateId FK, company, position, startDate, endDate?, description?, createdAt)
- [x] 1.7 Add `Document` model with all fields (UUID PK, candidateId FK, fileUri, fileName, mimeType, size Int, type DocumentType enum, uploadedAt)

## 2. Database Migration

- [x] 2.1 Ensure the PostgreSQL container is running: `docker compose up -d` from the repo root
- [x] 2.2 Run `npx prisma migrate dev --name init` from `backend/` to create and apply the initial migration
- [x] 2.3 Verify migration succeeded: confirm all five tables exist in the database (via `npx prisma studio` or `psql`)
- [x] 2.4 Run `npx prisma generate` to regenerate the Prisma client with all new types

## 3. Seed Script

- [x] 3.1 Create `backend/prisma/seed.ts`: import `PrismaClient`, define and call a `main()` function with `async/await`
- [x] 3.2 Implement idempotent cleanup at the start of `main()`: delete all Documents, WorkExperiences, Educations, Candidates, and Users in that order
- [x] 3.3 Insert 2 User records (recruiters) with UUIDs, distinct emails, and names
- [x] 3.4 Insert at least 5 Candidate records spread across both users, covering all `CandidateStatus` enum values at least once; include realistic firstName, lastName, email, phone, address
- [x] 3.5 Insert at least 1 Education record per candidate (covering varying fields: institution, degree, fieldOfStudy?, startDate, endDate with at least one null endDate for an in-progress degree)
- [x] 3.6 Insert at least 1 WorkExperience record per candidate (covering company, position, description?, startDate, endDate with at least one null endDate for a current job)
- [x] 3.7 Insert at least 1 Document record per candidate of type `CV` with `fileUri` in `fs://uploads/cv/<uuid>.pdf` format and realistic fileName, mimeType, size

## 4. Package Configuration

- [x] 4.1 Add `"prisma": { "seed": "ts-node prisma/seed.ts" }` to `backend/package.json`
- [x] 4.2 Run `npx prisma db seed` from `backend/` and verify it completes without errors
- [x] 4.3 Run `npx prisma db seed` a second time to verify idempotency (no duplicate key errors)

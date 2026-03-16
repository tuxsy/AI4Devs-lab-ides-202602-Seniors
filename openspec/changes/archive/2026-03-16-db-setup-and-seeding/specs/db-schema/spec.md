## ADDED Requirements

### Requirement: Complete Prisma schema with all ATS entities
The Prisma schema SHALL define models for `User`, `Candidate`, `Education`, `WorkExperience`, and `Document` with all fields, types, constraints, and relations as specified in `docs/data-model.md`. All primary keys SHALL use UUID (`String @id @default(uuid())`).

#### Scenario: User model has correct fields
- **WHEN** the Prisma schema is inspected
- **THEN** the `User` model SHALL have `id` (UUID PK), `email` (unique, non-null String), and `name` (nullable String)

#### Scenario: Candidate model has correct fields and enum
- **WHEN** the Prisma schema is inspected
- **THEN** the `Candidate` model SHALL have `id` (UUID PK), `userId` (FK to User), `firstName`, `lastName`, `email` (unique), `phone` (nullable), `address` (nullable), `status` (CandidateStatus enum, non-null), `createdAt` (auto DateTime), `updatedAt` (auto DateTime)

#### Scenario: Education model has correct fields
- **WHEN** the Prisma schema is inspected
- **THEN** the `Education` model SHALL have `id` (UUID PK), `candidateId` (FK to Candidate), `institution`, `degree`, `fieldOfStudy` (nullable), `startDate` (DateTime), `endDate` (nullable DateTime), `createdAt` (auto DateTime)

#### Scenario: WorkExperience model has correct fields
- **WHEN** the Prisma schema is inspected
- **THEN** the `WorkExperience` model SHALL have `id` (UUID PK), `candidateId` (FK to Candidate), `company`, `position`, `startDate` (DateTime), `endDate` (nullable DateTime), `description` (nullable String), `createdAt` (auto DateTime)

#### Scenario: Document model has correct fields and enum
- **WHEN** the Prisma schema is inspected
- **THEN** the `Document` model SHALL have `id` (UUID PK), `candidateId` (FK to Candidate), `fileUri`, `fileName`, `mimeType`, `size` (Int), `type` (DocumentType enum), `uploadedAt` (auto DateTime)

### Requirement: CandidateStatus enum is defined
The schema SHALL define a `CandidateStatus` enum with values: `ACTIVE`, `IN_PROCESS`, `HIRED`, `REJECTED`, `WITHDRAWN`.

#### Scenario: All enum values are present
- **WHEN** the Prisma schema is inspected
- **THEN** the `CandidateStatus` enum SHALL contain exactly the five values listed above

### Requirement: DocumentType enum is defined
The schema SHALL define a `DocumentType` enum with values: `CV`, `COVER_LETTER`, `OTHER`.

#### Scenario: All enum values are present
- **WHEN** the Prisma schema is inspected
- **THEN** the `DocumentType` enum SHALL contain exactly `CV`, `COVER_LETTER`, and `OTHER`

### Requirement: Initial migration creates all tables
Running `npx prisma migrate dev` SHALL produce a SQL migration that creates all five tables with correct columns, primary keys, foreign key constraints, and unique indexes.

#### Scenario: Migration applies cleanly on a fresh database
- **WHEN** `npx prisma migrate dev --name init` is run against an empty PostgreSQL database
- **THEN** all five tables SHALL exist with correct schema and no errors

#### Scenario: Prisma client is regenerated
- **WHEN** the migration is applied
- **THEN** `npx prisma generate` SHALL succeed and the generated client SHALL export types for all new models and enums

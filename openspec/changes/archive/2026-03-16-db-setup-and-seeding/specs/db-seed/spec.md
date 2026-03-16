## ADDED Requirements

### Requirement: Seed script populates the database with synthetic test data
The seed script (`prisma/seed.ts`) SHALL insert a representative set of synthetic data that exercises all models and enum values, enabling local development and testing without manual data entry.

#### Scenario: Seed inserts users
- **WHEN** `npx prisma db seed` is run
- **THEN** at least 2 `User` records SHALL exist in the database

#### Scenario: Seed inserts candidates linked to users
- **WHEN** `npx prisma db seed` is run
- **THEN** at least 5 `Candidate` records SHALL exist, each with a valid `userId` referencing an existing User, and each with a different `CandidateStatus` value represented at least once

#### Scenario: Seed inserts education records per candidate
- **WHEN** `npx prisma db seed` is run
- **THEN** each candidate SHALL have at least 1 `Education` record; at least one record SHALL have a null `endDate` (in-progress)

#### Scenario: Seed inserts work experience records per candidate
- **WHEN** `npx prisma db seed` is run
- **THEN** each candidate SHALL have at least 1 `WorkExperience` record; at least one record SHALL have a null `endDate` (current job)

#### Scenario: Seed inserts document records per candidate
- **WHEN** `npx prisma db seed` is run
- **THEN** each candidate SHALL have at least 1 `Document` record of type `CV` with a `fileUri` using the `fs://` scheme

### Requirement: Seed script is idempotent
Running the seed script multiple times SHALL produce the same final database state without duplicate key errors.

#### Scenario: Re-running seed does not fail
- **WHEN** `npx prisma db seed` is run twice in succession
- **THEN** the second run SHALL complete without errors and the record counts SHALL match the first run

### Requirement: Seed is configured in package.json
The `package.json` in `backend/` SHALL include a `prisma.seed` entry pointing to the seed script so that `npx prisma db seed` executes it.

#### Scenario: prisma db seed uses the correct script
- **WHEN** `npx prisma db seed` is run from the `backend/` directory
- **THEN** the `prisma/seed.ts` script SHALL be executed via `ts-node`

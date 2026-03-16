# AGENTS.md — LTI Talent Tracking System

Coding agent instructions for this repository.

---

## Project Overview

Full-stack ATS (Applicant Tracking System) with two independently managed packages:

```
/
├── backend/    # Express + Prisma REST API (port 3010, TypeScript)
├── frontend/   # React 18 CRA app (port 3000, TypeScript)
├── plan/       # Task specifications and user stories
└── docker-compose.yml  # PostgreSQL 5432
```

There is no root-level workspace manager. All commands must be run from within `backend/` or `frontend/`.

---

## Commands

### Backend (`backend/`)

```bash
npm run dev          # Start dev server with hot-reload (ts-node-dev)
npm run build        # Compile TypeScript → dist/
npm start            # Run compiled output (node dist/index.js)
npm test             # Run all tests (Jest + ts-jest)
```

### Frontend (`frontend/`)

```bash
npm start            # Start CRA dev server
npm run build        # Production build via react-scripts
npm test             # Run all tests (Jest + ts-jest)
```

### Running a Single Test

Both packages use `npx jest` to target specific tests. Run from inside the package directory.

```bash
# Run a single test file
npx jest src/tests/app.test.ts

# Run tests matching a name pattern
npx jest --testNamePattern "GET /"

# Run tests in a specific directory
npx jest src/tests/

# Watch mode for a single file
npx jest --watch src/tests/app.test.ts
```

### Database

```bash
docker compose up -d                  # Start PostgreSQL container
npx prisma migrate dev --name <name>  # Create and apply a migration
npx prisma generate                   # Regenerate Prisma client after schema changes
npx prisma studio                     # Open Prisma Studio GUI
npx prisma db seed                    # Run seed script (if configured)
```

Run Prisma commands from `backend/`.

### Lint & Format

ESLint and Prettier are configured in the backend. No `lint`/`format` npm scripts exist yet — run directly:

```bash
npx eslint src/                       # Lint backend TypeScript
npx prettier --write src/             # Format backend source files
```

Frontend uses CRA's default ESLint (`eslint-config-react-app`). No dedicated config file exists.

---

## Code Style

### TypeScript

- `strict: true` is enabled in both packages — all types must be explicit; avoid `any`.
- Backend compiles to CommonJS (`module: "commonjs"`); use `require`/`exports` semantics in config files.
- Frontend uses `"module": "esnext"` with `"noEmit": true` (CRA handles bundling).
- Target is `es5` in both packages.

### Formatting (Prettier — backend)

```json
{ "singleQuote": true, "trailingComma": "all" }
```

- **Single quotes** for all strings.
- **Trailing commas** on all multi-line function parameters, arrays, and objects.
- Enforce via `eslint-plugin-prettier` (backend `.eslintrc.js` extends `plugin:prettier/recommended`).

### Imports

- Group imports: external packages first, then internal modules, then types.
- Named imports before default imports within the same group.
- Use `import type` for type-only imports.

```typescript
// Good
import { Request, Response } from 'express';
import express from 'express';
import type { Candidate } from '../types';
import { candidateService } from '../services/candidateService';
```

- Backend: CommonJS-style module resolution (no path aliases configured).
- Frontend: Absolute imports from `src/` are not configured; use relative paths.

### Naming Conventions

| Construct | Convention | Example |
|-----------|------------|---------|
| Variables / functions | `camelCase` | `findCandidate`, `isValid` |
| Classes / interfaces / types | `PascalCase` | `CandidateService`, `ApiError` |
| React components | `PascalCase` | `CandidateForm` |
| Files (backend) | `camelCase` | `candidateService.ts` |
| Files (frontend components) | `PascalCase` | `CandidateForm.tsx` |
| Prisma models | `PascalCase` singular | `Candidate`, `WorkExperience` |
| Database columns | `camelCase` (Prisma maps to snake_case) | `firstName` |
| Constants | `UPPER_SNAKE_CASE` for true constants | `MAX_FILE_SIZE` |
| Test files | `<name>.test.ts(x)` | `candidateService.test.ts` |

### File Structure (Backend)

```
backend/src/
├── index.ts              # App entry point, Express setup, global middleware
├── routes/               # Express routers (one file per resource)
├── controllers/          # Request handlers (thin — delegate to services)
├── services/             # Business logic
├── repositories/         # Prisma data access layer
├── middleware/           # Express middleware (auth, error handling, validation)
├── types/                # Shared TypeScript types and interfaces
└── tests/                # All test files (mirrors src/ structure)
```

### File Structure (Frontend)

```
frontend/src/
├── App.tsx               # Root component
├── index.tsx             # React DOM entry point
├── components/           # Reusable UI components
├── pages/                # Page-level components
├── services/             # API client functions
├── types/                # TypeScript types and interfaces
└── tests/                # All test files
```

### Error Handling

- Use a centralized Express error handler in `backend/src/index.ts`.
- Throw errors with meaningful messages; never swallow exceptions silently.
- HTTP errors should use an `ApiError` class (or similar) with `statusCode` and `message`.
- Always return structured JSON error responses: `{ error: string, message: string }`.
- Log errors with `console.error` in the error middleware; avoid logging in service layer.

```typescript
// Controller pattern
try {
  const candidate = await candidateService.create(req.body);
  res.status(201).json(candidate);
} catch (error) {
  next(error); // pass to global error handler
}
```

### Prisma Client

- Instantiate once at module level in `backend/src/index.ts` (or a dedicated `prisma.ts`).
- Export as a singleton; import into repositories/services.
- Always `await` Prisma operations; never fire-and-forget.
- Handle `PrismaClientKnownRequestError` (e.g., unique constraint) explicitly in the service layer.

### React Components

- Use function components; no class components.
- The `react-jsx` transform is active — importing `React` is not required for JSX, but explicit imports are acceptable.
- Export components as default exports at the bottom of the file.
- Co-locate CSS: `Component.tsx` and `Component.css` in the same directory.
- UI library: Material UI (MUI) is planned for new components (per task-04).

### Testing

- Backend: Use `describe`/`it` blocks with `async/await`. Use `supertest` for HTTP endpoint tests.
- Frontend: Use React Testing Library with `test()` or `describe`/`it` blocks.
- Test files live in `src/tests/` in both packages.
- Import the Express `app` (not the server) in backend tests for supertest.
- Do not start the HTTP server in tests; export `app` separately from `app.listen()`.

```typescript
// backend/src/tests/example.test.ts
import request from 'supertest';
import { app } from '../index';

describe('GET /candidates', () => {
  it('returns 200 with candidate list', async () => {
    const res = await request(app).get('/candidates');
    expect(res.status).toBe(200);
  });
});
```

---

## Environment

- `backend/.env` — contains `DATABASE_URL` and other secrets. Never commit `.env` files.
- Database: PostgreSQL, credentials in `docker-compose.yml` (dev only).
- Backend port: `3010` (hardcoded in `src/index.ts`).
- Frontend port: `3000` (CRA default).
- Swagger UI available at `http://localhost:3010/api-docs` (configured via swagger-jsdoc).

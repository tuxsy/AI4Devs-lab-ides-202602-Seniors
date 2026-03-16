## Context

The LTI Talent Tracking System is a full-stack ATS with separate backend (Express + Prisma) and frontend (React) packages. Currently:

- **Database relationship exists**: Each `Candidate` has a `userId` foreign key linking to a `User` (recruiter)
- **No filtering implemented**: The `GET /candidates` endpoint returns all candidates regardless of `userId`
- **MVP authentication**: An `/autologin` endpoint returns the first user in the database (no real auth)
- **Dashboard shows wrong data**: The frontend dashboard fetches all candidates, not just those belonging to the logged-in recruiter

Key files:
- `backend/src/repositories/candidateRepository.ts` - data access layer
- `backend/src/services/candidateService.ts` - business logic
- `backend/src/routes/candidates.ts` - API endpoint
- `frontend/src/pages/Dashboard.tsx` - displays candidates
- `frontend/src/services/api.ts` - API client

## Goals / Non-Goals

**Goals:**
- Filter candidates by `userId` when fetching from the API
- Ensure each recruiter only sees their own candidates in the dashboard
- Maintain backward compatibility with existing pagination and status filtering
- Keep the MVP autologin mechanism (real auth is out of scope)

**Non-Goals:**
- Implementing JWT or session-based authentication (future work)
- Adding authorization middleware (future work)
- Securing the userId parameter against tampering (requires real auth)
- Modifying candidate creation flow

## Decisions

### Decision 1: Pass userId as required query parameter

**Choice**: Add `userId` as a **required** query parameter to `GET /candidates`

**Alternatives considered**:
1. **Header-based**: Pass userId in a custom header - rejected because it's awkward for REST APIs and harder to test
2. **Path-based**: `GET /users/:userId/candidates` - rejected because it requires route restructuring and doesn't fit current patterns
3. **Body-based**: Not applicable for GET requests
4. **Optional parameter**: Rejected to enforce data isolation by design - no accidental exposure of all candidates

**Rationale**: Query parameters are idiomatic for filtering in REST APIs, align with existing `page`, `limit`, `status` parameters, and are easy to implement/test. Making it required ensures recruiters always see only their own candidates.

### Decision 2: Validate userId presence at API level

**Choice**: The API returns 400 Bad Request if `userId` is not provided.

**Rationale**: Enforcing the requirement at the API level prevents accidental data leakage. All clients must explicitly specify which recruiter's candidates they want. When real auth is implemented, userId will come from the token instead.

### Decision 3: Filter in repository layer

**Choice**: Add the filtering logic in `candidateRepository.findAll()` rather than the service layer.

**Rationale**: The repository is responsible for data access. Filtering by userId is a data concern, not business logic. This keeps the service layer thin and focused on orchestration.

## Risks / Trade-offs

**[Risk] userId can be spoofed** → This is acceptable in the MVP because there's no real authentication. Mitigation is to implement JWT auth in a future change, extracting userId from the verified token.

**[Risk] Breaking change for existing API consumers** → Making userId required breaks any client not passing it. Mitigation: This is the correct behavior for an ATS - there's no valid use case for fetching all candidates across recruiters.

**[Trade-off] Query param vs auth token** → Using a query param is less secure but simpler for MVP. The architecture supports easy migration to token-based identification later.

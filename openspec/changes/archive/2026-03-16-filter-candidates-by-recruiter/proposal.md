## Why

The user dashboard displays "Your Candidates" but fetches and shows ALL candidates in the system, regardless of which recruiter added them. This breaks data isolation between recruiters - each recruiter should only see the candidates they manage, not candidates belonging to other recruiters.

## What Changes

- Modify the backend candidates endpoint to filter by the logged-in user's ID
- Update the repository layer to support filtering candidates by `userId`
- Pass the current user context from frontend to backend when fetching candidates
- Ensure the dashboard only displays candidates belonging to the authenticated recruiter

## Capabilities

### New Capabilities

- `recruiter-candidate-filtering`: Filter candidates by the recruiter/user who owns them, ensuring data isolation between recruiters in the ATS system.

### Modified Capabilities

(none - this is a new filtering capability layered on existing candidate listing)

## Impact

- **Backend API**: `GET /candidates` endpoint will require/accept a `userId` parameter to filter results
- **Backend Repository**: `candidateRepository.findAll()` will be extended to filter by `userId`
- **Frontend Dashboard**: Will pass the autologin user's ID when fetching candidates
- **Data Access**: Recruiters will only see their own candidates (breaking change in behavior, but fixing a bug)

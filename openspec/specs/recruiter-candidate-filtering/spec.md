# Recruiter Candidate Filtering

Filter candidates by the recruiter/user who owns them, ensuring data isolation between recruiters in the ATS system.

## Requirements

### Requirement: API requires userId to fetch candidates

The `GET /candidates` endpoint SHALL require a `userId` query parameter. The endpoint SHALL return only candidates where `candidate.userId` matches the provided value. Requests without `userId` SHALL be rejected with 400 Bad Request.

#### Scenario: Fetch candidates for a specific recruiter
- **WHEN** client sends `GET /candidates?userId=abc-123`
- **THEN** system returns only candidates where `userId` equals `abc-123`

#### Scenario: Fetch candidates without userId parameter
- **WHEN** client sends `GET /candidates` without userId parameter
- **THEN** system returns 400 Bad Request with error message "userId is required"

#### Scenario: Combine userId with other filters
- **WHEN** client sends `GET /candidates?userId=abc-123&status=ACTIVE&page=1&limit=10`
- **THEN** system returns paginated candidates matching both userId and status filters

### Requirement: Dashboard fetches only logged-in recruiter's candidates

The dashboard component SHALL pass the authenticated user's ID when fetching candidates, ensuring only the recruiter's own candidates are displayed.

#### Scenario: Dashboard loads recruiter's candidates
- **WHEN** recruiter views the dashboard
- **THEN** only candidates belonging to that recruiter are displayed

#### Scenario: Dashboard with no candidates
- **WHEN** recruiter has no candidates assigned
- **THEN** dashboard displays empty state (no candidates)

### Requirement: Repository supports userId filtering

The candidate repository's `findAll` method SHALL accept a `userId` parameter in its filter options and apply it to the database query.

#### Scenario: Repository filters by userId
- **WHEN** `findAll` is called with `{ userId: 'abc-123' }` in options
- **THEN** returned candidates all have `userId` equal to `abc-123`

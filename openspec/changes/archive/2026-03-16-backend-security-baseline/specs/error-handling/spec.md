## ADDED Requirements

### Requirement: All errors return structured JSON with no internal detail
The system SHALL use a centralized Express error handler (4-argument middleware, registered last) that returns `{ "error": "<type>", "message": "<user-safe message>" }` for all errors. Stack traces, Prisma internals, and PII SHALL NOT appear in responses.

#### Scenario: Validation error returns 400 with JSON body
- **WHEN** an error with `statusCode: 400` (or equivalent flag) is passed to `next()`
- **THEN** the response SHALL have HTTP status 400 and `Content-Type: application/json`
- **THEN** the body SHALL match `{ "error": "ValidationError", "message": "<safe message>" }`

#### Scenario: Unexpected error returns 500 with JSON body
- **WHEN** an unhandled error is passed to `next()`
- **THEN** the response SHALL have HTTP status 500 and `Content-Type: application/json`
- **THEN** the body SHALL match `{ "error": "InternalServerError", "message": "An unexpected error occurred" }`

#### Scenario: Error response never exposes stack traces
- **WHEN** any error occurs
- **THEN** the response body SHALL NOT contain a `stack` field or any internal file path

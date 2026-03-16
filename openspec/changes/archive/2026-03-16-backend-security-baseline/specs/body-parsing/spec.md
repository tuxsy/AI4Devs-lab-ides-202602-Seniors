## ADDED Requirements

### Requirement: API accepts JSON request bodies up to 1 MB
The system SHALL apply `express.json({ limit: '1mb' })` middleware so that endpoints can receive JSON payloads. Requests exceeding 1 MB SHALL be rejected with a 413 status.

#### Scenario: Valid JSON body is parsed
- **WHEN** a POST request is made with `Content-Type: application/json` and a valid JSON body under 1 MB
- **THEN** `req.body` SHALL contain the parsed object

#### Scenario: Oversized JSON body is rejected
- **WHEN** a POST request is made with a JSON body exceeding 1 MB
- **THEN** the response SHALL have HTTP status 413

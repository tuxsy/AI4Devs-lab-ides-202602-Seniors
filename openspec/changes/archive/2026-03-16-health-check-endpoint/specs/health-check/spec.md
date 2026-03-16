## ADDED Requirements

### Requirement: GET /health returns server and database status
The system SHALL expose a `GET /health` endpoint that returns a JSON object describing the operational status of the server and its database connection. No authentication is required.

#### Scenario: Server up and database reachable
- **WHEN** `GET /health` is requested and the PostgreSQL database responds to a ping
- **THEN** the response SHALL have HTTP status `200`
- **THEN** the response body SHALL be `{ "status": "ok", "uptime": <number>, "timestamp": "<ISO8601>", "db": { "status": "ok" } }`

#### Scenario: Server up but database unreachable
- **WHEN** `GET /health` is requested and the PostgreSQL database does not respond
- **THEN** the response SHALL have HTTP status `503`
- **THEN** the response body SHALL be `{ "status": "degraded", "uptime": <number>, "timestamp": "<ISO8601>", "db": { "status": "unreachable" } }`

#### Scenario: Response contains no sensitive data
- **WHEN** `GET /health` is requested
- **THEN** the response body SHALL NOT contain database credentials, connection strings, stack traces, or any PII

#### Scenario: Response Content-Type is JSON
- **WHEN** `GET /health` is requested
- **THEN** the response `Content-Type` header SHALL be `application/json`

## ADDED Requirements

### Requirement: Helmet middleware is active on all responses
The system SHALL apply `helmet` as the first middleware in the Express app, ensuring all HTTP responses include secure headers (e.g. `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, etc.).

#### Scenario: Response includes X-Frame-Options header
- **WHEN** any HTTP request is made to the API
- **THEN** the response SHALL include `X-Frame-Options: DENY`

#### Scenario: Response does not expose server technology
- **WHEN** any HTTP request is made to the API
- **THEN** the response SHALL NOT include an `X-Powered-By` header

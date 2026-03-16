## ADDED Requirements

### Requirement: CORS is restricted to an explicit origin allowlist
The system SHALL configure CORS using the `cors` middleware with `origin` set to the value of `process.env.ALLOWED_ORIGIN`. Cross-origin requests from unlisted origins SHALL be rejected.

#### Scenario: Request from allowed origin is accepted
- **WHEN** a cross-origin request arrives with an `Origin` header matching `ALLOWED_ORIGIN`
- **THEN** the response SHALL include `Access-Control-Allow-Origin` set to that origin

#### Scenario: Request from unlisted origin is rejected
- **WHEN** a cross-origin request arrives with an `Origin` header not matching `ALLOWED_ORIGIN`
- **THEN** the response SHALL NOT include `Access-Control-Allow-Origin`

#### Scenario: Wildcard origin is never used
- **WHEN** the CORS middleware is configured
- **THEN** `Access-Control-Allow-Origin: *` SHALL NOT appear in any response

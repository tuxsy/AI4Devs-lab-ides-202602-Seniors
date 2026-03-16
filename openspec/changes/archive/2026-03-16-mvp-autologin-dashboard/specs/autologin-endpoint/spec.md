## ADDED Requirements

### Requirement: Autologin endpoint returns user data

The system SHALL provide a GET `/autologin` endpoint that returns user data from the database for MVP development purposes.

The endpoint SHALL select the user by:
1. Querying all users from the database
2. Ordering by UUID ascendente
3. Returning the first user

The response SHALL include:
- `id`: UUID string identifying the user
- `email`: Valid email string
- `name`: Display name string

#### Scenario: Successful autologin request
- **WHEN** client sends GET request to `/autologin`
- **THEN** system returns HTTP 200 with JSON body containing `id`, `email`, and `name` fields

#### Scenario: No users in database
- **WHEN** client sends GET request to `/autologin` and no users exist
- **THEN** system returns HTTP 404 with error message "No users found"

### Requirement: Autologin endpoint is documented in Swagger

The `/autologin` endpoint SHALL be documented in Swagger UI with proper JSDoc annotations.

#### Scenario: Endpoint visible in Swagger UI
- **WHEN** user navigates to `/api-docs`
- **THEN** the `/autologin` endpoint is listed with its response schema

### Requirement: Autologin returns consistent user

The endpoint SHALL return the same user on every call (the first by UUID order) to ensure consistent behavior during development.

#### Scenario: Multiple requests return same user
- **WHEN** client sends multiple GET requests to `/autologin`
- **THEN** all responses contain identical user data

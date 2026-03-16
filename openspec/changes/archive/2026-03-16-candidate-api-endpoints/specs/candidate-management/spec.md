## ADDED Requirements

### Requirement: List candidates with pagination
The system SHALL provide an endpoint GET /candidates that returns a paginated list of candidates.

#### Scenario: List candidates with default pagination
- **WHEN** a GET request is made to /candidates without pagination parameters
- **THEN** the system returns HTTP 200 with the first 20 candidates ordered by createdAt descending
- **AND** the response includes pagination metadata (total, page, limit, totalPages)

#### Scenario: List candidates with custom pagination
- **WHEN** a GET request is made to /candidates with query parameters page=2 and limit=10
- **THEN** the system returns HTTP 200 with candidates 11-20 ordered by createdAt descending
- **AND** the response includes updated pagination metadata

#### Scenario: List candidates with status filter
- **WHEN** a GET request is made to /candidates with query parameter status=ACTIVE
- **THEN** the system returns HTTP 200 with only candidates having status ACTIVE

#### Scenario: List candidates with invalid pagination
- **WHEN** a GET request is made to /candidates with page=-1 or limit=0
- **THEN** the system returns HTTP 400 with error message indicating invalid pagination parameters

### Requirement: Get candidate detail
The system SHALL provide an endpoint GET /candidates/:id that returns the complete information of a candidate including related entities.

#### Scenario: Get existing candidate
- **WHEN** a GET request is made to /candidates/:id with a valid candidate UUID
- **THEN** the system returns HTTP 200 with the candidate data including education, workExperience, and documents arrays

#### Scenario: Get non-existent candidate
- **WHEN** a GET request is made to /candidates/:id with a UUID that does not exist
- **THEN** the system returns HTTP 404 with error "NotFound" and message "Candidate not found"

#### Scenario: Get candidate with invalid UUID format
- **WHEN** a GET request is made to /candidates/:id with an invalid UUID format
- **THEN** the system returns HTTP 400 with error "BadRequest" and message indicating invalid UUID format

### Requirement: Create candidate with related data
The system SHALL provide an endpoint POST /candidates that creates a candidate with optional education and work experience records in a single transaction.

#### Scenario: Create candidate with all fields
- **WHEN** a POST request is made to /candidates with valid firstName, lastName, email, phone, address, education array, and workExperience array
- **THEN** the system returns HTTP 201 with the created candidate including all related records
- **AND** the candidate status is set to ACTIVE by default

#### Scenario: Create candidate with minimal fields
- **WHEN** a POST request is made to /candidates with only required fields (firstName, lastName, email)
- **THEN** the system returns HTTP 201 with the created candidate
- **AND** phone and address are null, education and workExperience are empty arrays

#### Scenario: Create candidate with duplicate email
- **WHEN** a POST request is made to /candidates with an email that already exists in the system
- **THEN** the system returns HTTP 409 with error "Conflict" and message "A candidate with this email already exists"

#### Scenario: Create candidate with invalid email format
- **WHEN** a POST request is made to /candidates with an invalid email format
- **THEN** the system returns HTTP 400 with error "BadRequest" and validation error details

#### Scenario: Create candidate with invalid phone format
- **WHEN** a POST request is made to /candidates with a phone containing invalid characters (not digits, spaces, +, -)
- **THEN** the system returns HTTP 400 with error "BadRequest" and validation error details

#### Scenario: Create candidate with firstName exceeding max length
- **WHEN** a POST request is made to /candidates with firstName longer than 100 characters
- **THEN** the system returns HTTP 400 with error "BadRequest" and validation error details

#### Scenario: Create candidate with too many education records
- **WHEN** a POST request is made to /candidates with more than 20 education records
- **THEN** the system returns HTTP 400 with error "BadRequest" and message indicating maximum 20 education records allowed

#### Scenario: Create candidate with too many work experience records
- **WHEN** a POST request is made to /candidates with more than 20 workExperience records
- **THEN** the system returns HTTP 400 with error "BadRequest" and message indicating maximum 20 work experience records allowed

### Requirement: Validate candidate input data
The system SHALL validate all input fields server-side using strict schema validation with Zod.

#### Scenario: Reject request with unknown fields
- **WHEN** a POST request is made to /candidates with extra fields not defined in the schema
- **THEN** the system strips the unknown fields and processes only valid fields

#### Scenario: Sanitize HTML from text fields
- **WHEN** a POST request is made to /candidates with HTML tags in firstName, lastName, or address
- **THEN** the system strips the HTML tags before storing the data

### Requirement: Rate limit candidate creation
The system SHALL enforce rate limiting on the POST /candidates endpoint to prevent abuse.

#### Scenario: Allow requests within rate limit
- **WHEN** fewer than 30 requests are made from the same IP within 15 minutes
- **THEN** all requests are processed normally

#### Scenario: Block requests exceeding rate limit
- **WHEN** more than 30 requests are made from the same IP within 15 minutes
- **THEN** the system returns HTTP 429 with error "TooManyRequests" and message indicating rate limit exceeded

### Requirement: Return structured error responses
The system SHALL return all errors in a consistent JSON format.

#### Scenario: Return validation error
- **WHEN** a request fails validation
- **THEN** the system returns HTTP 400 with JSON body containing "error" and "message" fields

#### Scenario: Return server error without exposing internals
- **WHEN** an unexpected server error occurs
- **THEN** the system returns HTTP 500 with error "InternalServerError" and generic message "An unexpected error occurred"
- **AND** the system does NOT expose stack traces, Prisma errors, or PII in the response

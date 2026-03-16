## Requirements

### Requirement: Upload document for candidate
The system SHALL provide an endpoint POST /candidates/:id/documents that allows uploading a document (CV) for an existing candidate.

#### Scenario: Upload PDF document successfully
- **WHEN** a POST request is made to /candidates/:id/documents with a valid PDF file under 5MB
- **THEN** the system returns HTTP 201 with the created document record
- **AND** the file is stored with a UUID-based filename in the configured uploads directory
- **AND** the document record includes fileUri with fs:// scheme, original fileName, mimeType, and size

#### Scenario: Upload DOCX document successfully
- **WHEN** a POST request is made to /candidates/:id/documents with a valid DOCX file under 5MB
- **THEN** the system returns HTTP 201 with the created document record
- **AND** the file is stored with a UUID-based filename in the configured uploads directory

#### Scenario: Upload document for non-existent candidate
- **WHEN** a POST request is made to /candidates/:id/documents with a UUID that does not exist
- **THEN** the system returns HTTP 404 with error "NotFound" and message "Candidate not found"

#### Scenario: Upload document with invalid candidate UUID
- **WHEN** a POST request is made to /candidates/:id/documents with an invalid UUID format
- **THEN** the system returns HTTP 400 with error "BadRequest" and message indicating invalid UUID format

### Requirement: Validate document file type
The system SHALL only accept PDF and DOCX files for document uploads.

#### Scenario: Reject unsupported file type by MIME
- **WHEN** a POST request is made to /candidates/:id/documents with a file having MIME type other than application/pdf or application/vnd.openxmlformats-officedocument.wordprocessingml.document
- **THEN** the system returns HTTP 400 with error "BadRequest" and message "Only PDF and DOCX files are allowed"

#### Scenario: Reject unsupported file extension
- **WHEN** a POST request is made to /candidates/:id/documents with a file having extension other than .pdf or .docx
- **THEN** the system returns HTTP 400 with error "BadRequest" and message "Only PDF and DOCX files are allowed"

### Requirement: Enforce document size limit
The system SHALL reject documents exceeding 5MB in size.

#### Scenario: Reject file exceeding size limit
- **WHEN** a POST request is made to /candidates/:id/documents with a file larger than 5MB
- **THEN** the system returns HTTP 400 with error "BadRequest" and message "File size exceeds maximum allowed (5MB)"

### Requirement: Store documents securely
The system SHALL store uploaded documents with secure naming and path handling.

#### Scenario: Store file with UUID filename
- **WHEN** a document is uploaded successfully
- **THEN** the file is stored on disk with filename format <uuid>.<ext> where ext is pdf or docx
- **AND** the original filename is NOT used in the filesystem path

#### Scenario: Record document with URI scheme
- **WHEN** a document is uploaded successfully
- **THEN** the document record fileUri uses the fs:// scheme (e.g., fs://uploads/<uuid>.pdf)
- **AND** the uploads directory is read from UPLOAD_DIR environment variable, defaulting to ./uploads

#### Scenario: Prevent path traversal
- **WHEN** a document upload request contains path traversal characters in the filename (e.g., ../../../etc/passwd)
- **THEN** the system ignores the original path and uses only the UUID-based filename

### Requirement: Specify document type
The system SHALL allow specifying the document type (CV, COVER_LETTER, OTHER) when uploading.

#### Scenario: Upload with explicit document type
- **WHEN** a POST request is made to /candidates/:id/documents with type=CV in the form data
- **THEN** the document record is created with type CV

#### Scenario: Default to CV type when not specified
- **WHEN** a POST request is made to /candidates/:id/documents without specifying type
- **THEN** the document record is created with type CV as default

#### Scenario: Reject invalid document type
- **WHEN** a POST request is made to /candidates/:id/documents with an invalid type value
- **THEN** the system returns HTTP 400 with error "BadRequest" and message indicating valid types are CV, COVER_LETTER, OTHER

### Requirement: Rate limit document uploads
The system SHALL enforce rate limiting on the document upload endpoint to prevent abuse.

#### Scenario: Allow uploads within rate limit
- **WHEN** fewer than 30 upload requests are made from the same IP within 15 minutes
- **THEN** all requests are processed normally

#### Scenario: Block uploads exceeding rate limit
- **WHEN** more than 30 upload requests are made from the same IP within 15 minutes
- **THEN** the system returns HTTP 429 with error "TooManyRequests" and message indicating rate limit exceeded

---

## ADDED Requirements

### Requirement: CV upload field on Candidate Detail page
The Candidate Detail page SHALL include a file upload area for uploading CV documents.

#### Scenario: File upload area displayed
- **WHEN** Candidate Detail page is rendered
- **THEN** a file upload area/button is visible for CV upload

#### Scenario: File selection
- **WHEN** recruiter clicks upload area or button
- **THEN** file picker dialog opens

### Requirement: File type validation
The upload component SHALL only accept PDF and DOCX files, validating both file extension and MIME type.

#### Scenario: Valid PDF file
- **WHEN** recruiter selects a .pdf file with MIME type "application/pdf"
- **THEN** file is accepted and filename is displayed

#### Scenario: Valid DOCX file
- **WHEN** recruiter selects a .docx file with MIME type "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
- **THEN** file is accepted and filename is displayed

#### Scenario: Invalid file type
- **WHEN** recruiter selects a .jpg or .exe file
- **THEN** file is rejected with error message "Only PDF and DOCX files are allowed"

### Requirement: File size validation
The upload component SHALL reject files larger than 5 MB.

#### Scenario: File within size limit
- **WHEN** recruiter selects a 3 MB PDF file
- **THEN** file is accepted

#### Scenario: File exceeds size limit
- **WHEN** recruiter selects a 6 MB PDF file
- **THEN** file is rejected with error message "File size must not exceed 5 MB"

### Requirement: File removal before upload
The upload component SHALL allow recruiters to remove a selected file before uploading.

#### Scenario: Remove selected file
- **WHEN** recruiter clicks remove/clear button on selected file
- **THEN** file selection is cleared and upload field returns to empty state

### Requirement: Upload to backend
The upload component SHALL upload the document to the backend API.

#### Scenario: Successful document upload
- **WHEN** recruiter clicks upload with a valid file selected
- **THEN** system uploads document to POST /candidates/{id}/documents with type "CV"
- **AND** success message confirms document was uploaded
- **AND** document list on the page is refreshed

#### Scenario: Document upload failure
- **WHEN** document upload fails (network error or server error)
- **THEN** system shows error message with option to retry

### Requirement: No file preview
The upload component SHALL NOT render or preview the contents of uploaded files in the browser.

#### Scenario: File selected but not previewed
- **WHEN** recruiter selects a PDF file
- **THEN** only the filename and file size are displayed, NOT the file contents

### Requirement: Upload progress indication
The upload component SHALL show upload progress or loading state during file upload.

#### Scenario: Upload in progress
- **WHEN** document is being uploaded to backend
- **THEN** loading indicator or progress bar is visible
- **AND** upload button is disabled to prevent duplicate submissions

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

## ADDED Requirements

### Requirement: Navigate to candidate detail from Dashboard
The Dashboard candidate list SHALL allow recruiters to click on a candidate row to view their details.

#### Scenario: Click candidate row
- **WHEN** recruiter clicks on a candidate row in the Dashboard table
- **THEN** the system navigates to the Candidate Detail page for that candidate

### Requirement: Display candidate personal information
The Candidate Detail page SHALL display the candidate's personal information: name, email, phone, address, and status.

#### Scenario: Personal info displayed
- **WHEN** Candidate Detail page loads
- **THEN** firstName, lastName, email, phone, and address are displayed
- **AND** candidate status is shown with appropriate visual indicator

### Requirement: Display education history
The Candidate Detail page SHALL display all education entries for the candidate.

#### Scenario: Education entries displayed
- **WHEN** Candidate Detail page loads and candidate has education records
- **THEN** all education entries are displayed with institution, degree, field of study, and dates

#### Scenario: No education entries
- **WHEN** Candidate Detail page loads and candidate has no education records
- **THEN** a message indicating no education history is shown

### Requirement: Display work experience history
The Candidate Detail page SHALL display all work experience entries for the candidate.

#### Scenario: Work experience entries displayed
- **WHEN** Candidate Detail page loads and candidate has work experience records
- **THEN** all work experience entries are displayed with company, position, dates, and description

#### Scenario: No work experience entries
- **WHEN** Candidate Detail page loads and candidate has no work experience records
- **THEN** a message indicating no work experience is shown

### Requirement: Display uploaded documents
The Candidate Detail page SHALL display a list of documents already uploaded for the candidate.

#### Scenario: Documents listed
- **WHEN** Candidate Detail page loads and candidate has documents
- **THEN** document list shows filename, type, and upload date for each document

#### Scenario: No documents
- **WHEN** Candidate Detail page loads and candidate has no documents
- **THEN** a message indicating no documents uploaded is shown

### Requirement: Upload document from detail page
The Candidate Detail page SHALL allow recruiters to upload CV documents.

#### Scenario: Upload document successfully
- **WHEN** recruiter selects a valid file and uploads
- **THEN** document is uploaded to POST /candidates/{id}/documents
- **AND** document list is refreshed to show the new document
- **AND** success message is displayed

#### Scenario: Upload document failure
- **WHEN** document upload fails
- **THEN** user-friendly error message is displayed
- **AND** recruiter can retry the upload

### Requirement: Back navigation
The Candidate Detail page SHALL allow recruiters to navigate back to the Dashboard.

#### Scenario: Back to Dashboard
- **WHEN** recruiter clicks Back or Dashboard link
- **THEN** system navigates to Dashboard

### Requirement: Loading state
The Candidate Detail page SHALL show a loading indicator while fetching candidate data.

#### Scenario: Loading indicator
- **WHEN** candidate data is being fetched
- **THEN** a loading spinner or indicator is displayed

### Requirement: Error handling
The Candidate Detail page SHALL handle errors when fetching candidate data.

#### Scenario: Candidate not found
- **WHEN** candidate ID does not exist
- **THEN** error message "Candidate not found" is displayed
- **AND** option to return to Dashboard is provided

#### Scenario: Network error
- **WHEN** network request fails
- **THEN** user-friendly error message is displayed
- **AND** option to retry or return to Dashboard is provided

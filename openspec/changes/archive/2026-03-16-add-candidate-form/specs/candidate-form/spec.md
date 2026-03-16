## ADDED Requirements

### Requirement: Add Candidate button on Dashboard
The Dashboard SHALL display a clearly visible "Add Candidate" button that navigates to the candidate form.

#### Scenario: Button visibility
- **WHEN** Dashboard is displayed
- **THEN** an "Add Candidate" button is clearly visible in the UI

#### Scenario: User clicks Add Candidate button
- **WHEN** recruiter clicks the "Add Candidate" button on Dashboard
- **THEN** the system displays the Add Candidate form

### Requirement: Personal information fields
The form SHALL include fields for candidate personal information: firstName (required), lastName (required), email (required), phone (optional), and address (optional).

#### Scenario: Required field indicators
- **WHEN** form is displayed
- **THEN** required fields (firstName, lastName, email) are visually marked with asterisk or similar indicator

#### Scenario: All personal fields editable
- **WHEN** recruiter interacts with personal information section
- **THEN** all fields accept text input with appropriate keyboard types (text for names, email for email, tel for phone)

### Requirement: Education entries management
The form SHALL allow recruiters to add multiple education entries with fields: institution (required), degree (required), fieldOfStudy (optional), startDate (required), endDate (optional).

#### Scenario: Add first education entry
- **WHEN** recruiter clicks "Add Education" button
- **THEN** an empty education entry form section appears with all education fields

#### Scenario: Add additional education entries
- **WHEN** recruiter has one or more education entries and clicks "Add Education"
- **THEN** a new empty education entry is added below existing entries

#### Scenario: Remove education entry
- **WHEN** recruiter clicks remove/delete button on an education entry
- **THEN** that education entry is removed from the form

### Requirement: Work experience entries management
The form SHALL allow recruiters to add multiple work experience entries with fields: company (required), position (required), startDate (required), endDate (optional), description (optional).

#### Scenario: Add first work experience entry
- **WHEN** recruiter clicks "Add Work Experience" button
- **THEN** an empty work experience entry form section appears

#### Scenario: Add additional work experience entries
- **WHEN** recruiter has one or more work experience entries and clicks "Add Work Experience"
- **THEN** a new empty work experience entry is added below existing entries

#### Scenario: Remove work experience entry
- **WHEN** recruiter clicks remove/delete button on a work experience entry
- **THEN** that work experience entry is removed from the form

### Requirement: Form submission
The form SHALL submit candidate data to the backend API when the recruiter clicks the Submit button and validation passes.

#### Scenario: Successful candidate creation
- **WHEN** recruiter fills valid data and clicks Submit
- **THEN** the system sends POST request to /candidates with form data
- **AND** displays success confirmation message
- **AND** offers navigation back to Dashboard

#### Scenario: API error during submission
- **WHEN** backend returns an error (4xx or 5xx)
- **THEN** the system displays a user-friendly error message (not raw API response)
- **AND** the form remains editable for correction

### Requirement: Form cancellation
The form SHALL allow recruiters to cancel and return to Dashboard without submitting.

#### Scenario: Cancel form
- **WHEN** recruiter clicks Cancel button
- **THEN** the system navigates back to Dashboard without saving data

### Requirement: Autocomplete disabled for PII
The form SHALL disable browser autocomplete on all candidate data fields to protect PII.

#### Scenario: Browser autocomplete disabled
- **WHEN** form fields are rendered
- **THEN** autocomplete attribute is set to "off" on the form or individual PII fields

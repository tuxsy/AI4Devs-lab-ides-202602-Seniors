## ADDED Requirements

### Requirement: Client-side validation before submission
The form SHALL validate all fields before allowing submission and display inline errors without submitting invalid data.

#### Scenario: Submit blocked on validation failure
- **WHEN** recruiter clicks Submit with invalid data
- **THEN** form submission is prevented
- **AND** inline error messages appear next to invalid fields

#### Scenario: Valid form submission
- **WHEN** all validation rules pass
- **THEN** the Submit button triggers API request

### Requirement: Email format validation
The form SHALL validate that email field contains a valid email format.

#### Scenario: Invalid email format
- **WHEN** recruiter enters "notanemail" in email field and attempts submit
- **THEN** error message "Please enter a valid email address" is displayed

#### Scenario: Valid email format
- **WHEN** recruiter enters "test@example.com" in email field
- **THEN** no email validation error is shown

### Requirement: Required field validation
The form SHALL validate that all required fields are non-empty: firstName, lastName, email.

#### Scenario: Empty required field
- **WHEN** recruiter leaves firstName, lastName, or email empty and attempts submit
- **THEN** error message indicating the field is required appears

#### Scenario: All required fields filled
- **WHEN** all required fields have values
- **THEN** no required field errors are shown

### Requirement: Max length validation
The form SHALL enforce maximum lengths matching backend constraints: firstName (100), lastName (100), phone (50), address (500).

#### Scenario: Field exceeds max length
- **WHEN** recruiter enters more than 100 characters in firstName field
- **THEN** error message indicating maximum length is displayed

### Requirement: Education entry validation
The form SHALL validate education entries requiring: institution, degree, startDate.

#### Scenario: Incomplete education entry
- **WHEN** recruiter adds education entry but leaves institution empty
- **THEN** error message for institution field is displayed on that entry

#### Scenario: Valid education entry
- **WHEN** all required education fields are filled
- **THEN** no education validation errors are shown

### Requirement: Work experience entry validation
The form SHALL validate work experience entries requiring: company, position, startDate.

#### Scenario: Incomplete work experience entry
- **WHEN** recruiter adds work experience entry but leaves company empty
- **THEN** error message for company field is displayed on that entry

#### Scenario: Valid work experience entry
- **WHEN** all required work experience fields are filled
- **THEN** no work experience validation errors are shown

### Requirement: Date validation
The form SHALL validate that dates are valid and endDate is not before startDate when both are provided.

#### Scenario: End date before start date
- **WHEN** recruiter enters endDate earlier than startDate in education or work experience
- **THEN** error message "End date cannot be before start date" is displayed

### Requirement: Validation on field blur
The form SHOULD validate individual fields when they lose focus to provide immediate feedback.

#### Scenario: Field blur triggers validation
- **WHEN** recruiter fills email field with invalid value and tabs away
- **THEN** validation error appears immediately without waiting for submit

### Requirement: Clear errors on correction
The form SHALL clear validation errors when the user corrects the invalid value.

#### Scenario: Error cleared after correction
- **WHEN** recruiter corrects an invalid email and the field loses focus
- **THEN** the email validation error is removed

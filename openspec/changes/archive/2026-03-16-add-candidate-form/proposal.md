## Why

Recruiters need a way to add candidates to the ATS system. Currently, the Dashboard displays existing candidates but provides no mechanism to create new ones. Without this capability, the core user story ("As a recruiter, I want to add candidates to the system") cannot be fulfilled.

Additionally, recruiters need to view candidate details and upload documents (CV) after creating candidates.

## What Changes

- Add a clearly visible "Add Candidate" button on the Dashboard (user-dashboard)
- Add a new "Add Candidate" form page with Material UI components
- Implement form validation matching backend constraints (required fields, email format, phone format, max lengths)
- Support dynamic education and work experience entries (add/remove multiple records)
- Add a new "Candidate Detail" page accessible by clicking on a candidate in the Dashboard list
- Integrate CV/document upload on the Candidate Detail page (not on the creation form)
- Add API client methods for candidate creation, fetching candidate details, and document upload
- Display success confirmation and error handling per frontend-security.md guidelines

## Capabilities

### New Capabilities
- `candidate-form`: Add candidate form with personal info, education, and work experience (no document upload)
- `candidate-detail`: Candidate detail page showing full info and allowing document uploads
- `form-validation`: Client-side validation with zod schema mirroring backend rules
- `document-upload`: File upload component with type/size validation (used on candidate detail page)

### Modified Capabilities
<!-- No existing specs require modification -->

## Impact

- **Frontend code**: New page components (AddCandidate, CandidateDetail), form components, validation schemas, API service methods
- **Types**: Extended TypeScript types for CreateCandidateInput, CandidateDetail, Education, WorkExperience, Document
- **Dependencies**: May need zod for validation, possibly date-fns for date handling
- **Navigation**: Dashboard links to AddCandidate form and to CandidateDetail page (clickable rows)

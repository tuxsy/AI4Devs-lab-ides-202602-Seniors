## 1. Setup & Dependencies

- [x] 1.1 Install zod validation library in frontend package
- [x] 1.2 Add TypeScript types for CreateCandidateInput, CandidateDetail, Education, WorkExperience, Document to types/api.ts

## 2. API Client Extensions

- [x] 2.1 Add createCandidate method to ApiClient (POST /candidates)
- [x] 2.2 Add getCandidateById method to ApiClient (GET /candidates/{id})
- [x] 2.3 Add uploadDocument method to ApiClient (POST /candidates/{id}/documents with multipart/form-data)
- [x] 2.4 Add proper error handling that returns status codes for ERROR_MESSAGES mapping

## 3. Validation Schema

- [x] 3.1 Create validation/candidateSchema.ts with zod schemas mirroring backend rules
- [x] 3.2 Include schemas for Education and WorkExperience entries with required fields
- [x] 3.3 Add date validation (endDate >= startDate when both present)
- [x] 3.4 Add max length constraints (firstName: 100, lastName: 100, phone: 50, address: 500)

## 4. File Upload Component

- [x] 4.1 Create components/FileUpload.tsx with drag-and-drop or button upload
- [x] 4.2 Implement file type validation (PDF and DOCX only, check MIME type)
- [x] 4.3 Implement file size validation (max 5 MB)
- [x] 4.4 Display selected filename and size (no preview)
- [x] 4.5 Add remove/clear button for selected file
- [x] 4.6 Add loading state during upload

## 5. Add Candidate Form Components

- [x] 5.1 Create components/EducationEntry.tsx for single education record with remove button
- [x] 5.2 Create components/WorkExperienceEntry.tsx for single work experience record with remove button
- [x] 5.3 Create pages/AddCandidate.tsx main form page with all sections
- [x] 5.4 Implement personal info section (firstName, lastName, email, phone, address)
- [x] 5.5 Implement education section with add/remove functionality
- [x] 5.6 Implement work experience section with add/remove functionality
- [x] 5.7 Set autocomplete="off" on form or PII fields

## 6. Form Validation & Submission

- [x] 6.1 Integrate zod validation with form state
- [x] 6.2 Display inline validation errors below fields
- [x] 6.3 Implement onBlur validation for immediate feedback
- [x] 6.4 Clear errors when user corrects invalid values
- [x] 6.5 Mark required fields with asterisk indicator

## 7. Add Candidate Submission Flow

- [x] 7.1 Implement form submission with loading state
- [x] 7.2 Call createCandidate API on submit
- [x] 7.3 Display user-friendly error messages (map HTTP status codes)
- [x] 7.4 Display success confirmation with back-to-dashboard option

## 8. Candidate Detail Page

- [x] 8.1 Create pages/CandidateDetail.tsx page component
- [x] 8.2 Fetch candidate data using getCandidateById on mount
- [x] 8.3 Display loading state while fetching
- [x] 8.4 Handle errors (not found, network error) with user-friendly messages
- [x] 8.5 Display personal information section
- [x] 8.6 Display education history section (or empty state message)
- [x] 8.7 Display work experience section (or empty state message)
- [x] 8.8 Display documents list (or empty state message)
- [x] 8.9 Integrate FileUpload component for adding documents
- [x] 8.10 Refresh document list after successful upload
- [x] 8.11 Add back navigation to Dashboard

## 9. Navigation & Dashboard Updates

- [x] 9.1 Add view state to App.tsx for Dashboard/AddCandidate/CandidateDetail switching
- [x] 9.2 Add selectedCandidateId state for detail page navigation
- [x] 9.3 Add clearly visible "Add Candidate" button to Dashboard
- [x] 9.4 Make candidate rows clickable in Dashboard table
- [x] 9.5 Implement Cancel button navigation from AddCandidate to Dashboard
- [x] 9.6 Navigate to Dashboard on successful candidate creation

## 10. Styling & Polish

- [x] 10.1 Add CSS for AddCandidate page (pages/AddCandidate.css)
- [x] 10.2 Add CSS for CandidateDetail page (pages/CandidateDetail.css)
- [x] 10.3 Use MUI components consistently (TextField, Button, Card, etc.)
- [x] 10.4 Add clear visual section dividers for personal/education/experience
- [x] 10.5 Style candidate rows as clickable (cursor, hover effect)
- [x] 10.6 Ensure responsive layout for different screen sizes

## 11. Testing

- [x] 11.1 Add unit tests for validation schema
- [x] 11.2 Add component tests for FileUpload validation
- [x] 11.3 Add integration test for form submission flow
- [x] 11.4 Add tests for CandidateDetail page rendering
- [x] 11.5 Run existing tests to ensure no regressions

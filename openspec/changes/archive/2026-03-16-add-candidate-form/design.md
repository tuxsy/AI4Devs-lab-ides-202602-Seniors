## Context

The LTI ATS frontend currently has a Dashboard that displays candidates but no way to create them or view their details. The backend API already supports candidate creation (`POST /candidates`), fetching candidate details (`GET /candidates/{id}`), and document upload (`POST /candidates/{id}/documents`) as defined in openapi.json.

Current state:
- React 18 + TypeScript frontend (CRA)
- Material UI components already in use (Dashboard)
- API client exists at `services/api.ts` with basic fetch wrapper
- Types defined at `types/api.ts` (partial - missing CreateCandidateInput types)
- No form library or validation library currently installed
- No routing library (single-page Dashboard)

Constraints:
- Must follow frontend-security.md guidelines (no PII in localStorage, autocomplete="off", etc.)
- Backend is authoritative for validation; client-side is UX only
- File uploads limited to PDF/DOCX, max 5MB
- Auth is out of scope (use /autologin endpoint)

## Goals / Non-Goals

**Goals:**
- Create intuitive add-candidate form matching user story requirements
- Add "Add Candidate" button clearly visible on Dashboard
- Implement client-side validation mirroring backend rules
- Support multiple education and work experience entries
- Create candidate detail page showing full candidate info
- Enable CV upload from the candidate detail page
- Show success confirmation and handle errors gracefully
- Make candidate rows clickable in Dashboard to navigate to detail page
- Integrate with existing API client pattern

**Non-Goals:**
- Document upload during candidate creation (upload happens on detail page)
- Full routing system (simple state-based navigation is sufficient for MVP)
- Autocomplete for education/work fields (noted in task-05 as "consider" - defer to future)
- Edit existing candidates
- Delete candidates or documents
- Real authentication system

## Decisions

### 1. Form State Management: React useState with controlled components
**Rationale**: No need for heavy form library for MVP. useState provides direct control and matches existing Dashboard patterns. Zod handles validation separately.

**Alternatives considered**:
- react-hook-form: Good for complex forms but adds dependency; overkill for single form
- Formik: Heavier than needed; useState simpler for this scope

### 2. Validation Library: Zod
**Rationale**: Recommended in frontend-security.md. TypeScript-first, composable schemas, excellent error messages. Can share schema patterns with backend if needed later.

**Alternatives considered**:
- Yup: Popular but less TypeScript-friendly than Zod
- Manual validation: Error-prone, harder to maintain

### 3. Navigation: State-based with view switching
**Rationale**: Three views (Dashboard, AddCandidate, CandidateDetail). Installing react-router for this is overhead. Simple state in App.tsx controls which page renders. Pass candidate ID when navigating to detail.

**Alternatives considered**:
- React Router: Standard routing but unnecessary for three pages
- Browser history API: Manual complexity

### 4. Form Structure: Multi-step appearance, single-page implementation
**Rationale**: Single scrollable form with clear sections. Easier to implement, validate holistically before submit. Visual dividers make it feel organized.

### 5. Dynamic Arrays (Education/WorkExperience): Array state with add/remove
**Rationale**: Start with empty arrays, allow adding entries. Each entry is a collapsible card. Remove button on each card.

### 6. Document Upload: Separate from candidate creation
**Rationale**: Per user feedback, document upload happens on the candidate detail page after the candidate is created. This simplifies the creation flow and allows multiple document uploads over time.

### 7. Candidate Detail Page: View info + upload documents
**Rationale**: Clicking a candidate row in Dashboard navigates to detail page. Shows all candidate info (personal, education, work experience, documents). Upload widget on this page for adding CVs.

## Risks / Trade-offs

**[Risk] No routing means browser back button won't work**
→ Mitigation: Acceptable for MVP. Add confirmation dialog if form has unsaved data.

**[Risk] Zod adds bundle size**
→ Mitigation: ~15KB gzipped - acceptable trade-off for validation correctness.

**[Risk] Large forms can be overwhelming**
→ Mitigation: Use MUI Accordion or clear section headers. Education/WorkExperience start collapsed or empty.

**[Risk] State-based navigation loses state on refresh**
→ Mitigation: Acceptable for MVP. Always returns to Dashboard on refresh.

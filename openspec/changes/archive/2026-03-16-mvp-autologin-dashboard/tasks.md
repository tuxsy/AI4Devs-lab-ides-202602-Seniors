## 1. Backend - Autologin Endpoint

- [x] 1.1 Create autologin router in `backend/src/routes/autologin.ts` with GET `/` endpoint that queries first user by UUID order
- [x] 1.2 Add JSDoc/Swagger annotations for endpoint documentation
- [x] 1.3 Register autologin router in `backend/src/index.ts` at path `/autologin`
- [x] 1.4 Verify endpoint appears in Swagger UI at `/api-docs`
- [x] 1.5 Regenerate openapi.json: `curl http://localhost:3010/api-docs.json -o openapi.json`

## 2. Backend - Testing

- [x] 2.1 Create test file `backend/src/tests/autologin.test.ts`
- [x] 2.2 Add test case: GET /autologin returns 200 with user data when users exist
- [x] 2.3 Add test case: response contains id, email, and name fields
- [x] 2.4 Add test case: GET /autologin returns 404 when no users exist

## 3. Frontend - API Service

- [x] 3.1 Create `frontend/src/services/api.ts` with base configuration
- [x] 3.2 Add `getAutologin()` function to fetch user data
- [x] 3.3 Add `getCandidates()` function to fetch candidates list
- [x] 3.4 Define TypeScript types for User and Candidate responses

## 4. Frontend - Dashboard Component

- [x] 4.1 Install Material UI dependencies: `npm install @mui/material @emotion/react @emotion/styled`
- [x] 4.2 Create `frontend/src/pages/Dashboard.tsx` component
- [x] 4.3 Implement autologin fetch on component mount using useEffect
- [x] 4.4 Implement user info card displaying name and email
- [x] 4.5 Implement candidates table with name, email, status columns
- [x] 4.6 Add loading state with CircularProgress component
- [x] 4.7 Add error handling with error message display
- [x] 4.8 Add empty state message when no candidates exist

## 5. Frontend - Integration

- [x] 5.1 Update `frontend/src/App.tsx` to render Dashboard as main component
- [x] 5.2 Create `frontend/src/pages/Dashboard.css` for any custom styles

## 6. Verification

- [x] 6.1 Run backend tests: `npm test` in backend directory
- [x] 6.2 Run frontend tests: `npm test` in frontend directory
- [x] 6.3 Manual test: verify dashboard loads and displays user + candidates

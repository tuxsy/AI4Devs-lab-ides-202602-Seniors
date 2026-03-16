## 1. Backend Repository Layer

- [x] 1.1 Add `userId` to the filter options interface in `candidateRepository.ts`
- [x] 1.2 Modify `findAll()` to include `userId` in the Prisma `where` clause (required)
- [x] 1.3 Add unit tests for repository filtering by userId

## 2. Backend Service Layer

- [x] 2.1 Update `candidateService.getAllCandidates()` to require and pass userId to repository
- [x] 2.2 Add unit tests for service layer userId filtering

## 3. Backend API Layer

- [x] 3.1 Add `userId` query parameter validation (return 400 if missing)
- [x] 3.2 Pass userId from request query to service layer
- [x] 3.3 Update Swagger/OpenAPI documentation for the required parameter
- [x] 3.4 Add integration tests for `GET /candidates?userId=...` and missing userId case

## 4. Frontend API Client

- [x] 4.1 Update `getCandidates()` in `api.ts` to require userId parameter
- [x] 4.2 Modify API call to include userId as query parameter

## 5. Frontend Dashboard

- [x] 5.1 Pass the autologin user's ID to `getCandidates()` call in Dashboard.tsx
- [x] 5.2 Verify dashboard displays only the recruiter's candidates
- [x] 5.3 Manual testing: create candidates for different users and verify isolation

## 6. Verification

- [x] 6.1 Run all backend tests (`npm test` in backend/)
- [x] 6.2 Run all frontend tests (`npm test` in frontend/)
- [x] 6.3 End-to-end manual verification in browser

# Frontend Security — MVP

Stack: React 18 (CRA) + TypeScript  
Scope: Candidate add form with PII fields and CV upload. Auth is out of scope; assume the user is a verified recruiter.

---

## Input Validation

Client-side validation is a UX layer only — the backend is the authoritative validator.

✅ MUST validate all fields before submission and show inline errors without submitting.  
✅ MUST enforce the same field rules as the backend (max lengths, email format, phone format).  
⚠️ SHOULD use a schema validation library (e.g. `zod` or `yup`) to share or mirror backend rules.  
❌ MUST NOT treat passing client-side validation as sufficient — always expect the backend to reject.

---

## File Upload

✅ MUST validate file type client-side before sending: allow only `.pdf` and `.docx`.  
✅ MUST validate file size client-side: reject files larger than **5 MB** before upload.  
✅ MUST show a clear error message when type or size validation fails.  
❌ MUST NOT rely solely on file extension — also check `file.type` (MIME type).  
❌ MUST NOT preview or render the contents of uploaded files in the browser.

```ts
// Example file guard
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function isValidFile(file: File): boolean {
  return ALLOWED_TYPES.includes(file.type) && file.size <= MAX_SIZE;
}
```

---

## XSS Prevention

✅ MUST use React's default JSX rendering for all dynamic content — it escapes output automatically.  
❌ MUST NOT use `dangerouslySetInnerHTML` anywhere in the candidate form or related components.  
❌ MUST NOT inject raw API response strings into the DOM outside of React's rendering.

---

## Sensitive Data in the Browser

❌ MUST NOT store any candidate PII in `localStorage` or `sessionStorage`.  
❌ MUST NOT store any candidate PII in URL query parameters or the browser history.  
⚠️ SHOULD keep candidate data only in component state, cleared on form reset or navigation.

---

## Form Autocomplete

⚠️ SHOULD set `autocomplete="off"` on the candidate form fields to prevent browsers from caching PII.  
⚠️ SHOULD set `autocomplete="email"` only for the recruiter's own login fields (future), not for candidate email inputs.

---

## Error Handling

✅ MUST display generic, user-friendly error messages — never raw API error details.  
❌ MUST NOT render server error messages, stack traces, or internal field names in the UI.  
⚠️ SHOULD map known HTTP status codes (`400`, `409`, `500`) to specific UI messages.

```ts
// Example mapping
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Please review the form — some fields are invalid.',
  409: 'A candidate with this email already exists.',
  500: 'An unexpected error occurred. Please try again later.',
};
```

---

## API Communication

✅ MUST send all API requests to the backend origin defined in an environment variable (`REACT_APP_API_URL`).  
❌ MUST NOT hardcode backend URLs.  
⚠️ SHOULD set `Content-Type: application/json` explicitly on JSON requests.  
⚠️ SHOULD handle network errors (fetch rejection) and show a connection error message.

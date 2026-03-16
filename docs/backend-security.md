# Backend Security — MVP

Stack: Express + Prisma + PostgreSQL + TypeScript  
Scope: Candidate data (PII) and CV file uploads. Auth is out of scope; assume the caller is a verified recruiter.

---

## HTTP Headers

✅ MUST install and enable `helmet` as the first middleware in `index.ts`.  
✅ MUST configure `helmet.frameguard({ action: 'deny' })` to prevent clickjacking.  
⚠️ SHOULD disable the `X-Powered-By` header (`app.disable('x-powered-by')` — helmet does this by default).

---

## CORS

✅ MUST install and configure `cors` with an explicit `origin` allowlist.  
✅ MUST read the allowed origin from an environment variable (e.g. `ALLOWED_ORIGIN`).  
❌ MUST NOT use `origin: '*'` in any environment.

```ts
// Example
app.use(cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true }));
```

---

## Input Validation — Candidate Data

All fields must be validated **server-side**, regardless of client-side validation.

✅ MUST validate and sanitize every field before passing it to Prisma.  
✅ MUST use a schema validation library (e.g. `zod`) to define and enforce the candidate schema.  
✅ MUST reject requests with unknown/extra fields (strict schema, `strip` unknown keys).  
❌ MUST NOT trust client-supplied data types — coerce and validate explicitly.

**Field rules:**

| Field | Rule |
|---|---|
| `firstName`, `lastName` | Non-empty string, max 100 chars, strip HTML |
| `email` | Valid email format |
| `phone` | Optional; if present, digits/spaces/`+`/`-` only, max 20 chars |
| `address` | Optional string, max 300 chars, strip HTML |
| `education` | Array of objects with defined schema, max 20 items |
| `workExperience` | Array of objects with defined schema, max 20 items |

---

## File Uploads — CV (PDF / DOCX)

✅ MUST use `multer` for multipart handling.  
✅ MUST validate MIME type: allow only `application/pdf` and `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.  
✅ MUST validate file extension: allow only `.pdf` and `.docx`.  
✅ MUST enforce a maximum file size of **5 MB**.  
✅ MUST store files in the `uploads/` directory at the project root.  
✅ MUST rename files on disk to a UUID-based name (e.g. `<uuid>.<ext>`) — never use the original filename.  
✅ MUST read the `uploads/` path from an environment variable (`UPLOAD_DIR`), defaulting to `./uploads`.  
❌ MUST NOT store the original filename in the filesystem.  
❌ MUST NOT allow path traversal — never use user input to build file paths.  
❌ MUST NOT execute or serve uploaded files with a content-type that allows script execution.

```ts
// Example multer config
const storage = multer.diskStorage({
  destination: process.env.UPLOAD_DIR ?? './uploads',
  filename: (_req, _file, cb) => cb(null, `${uuidv4()}.${ext}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    cb(null, allowed.includes(file.mimetype));
  },
});
```

---

## Error Handling

✅ MUST use a centralized Express error handler as the last middleware.  
✅ MUST return structured JSON errors: `{ "error": "<type>", "message": "<user-safe message>" }`.  
✅ MUST return `400` for validation errors, `500` for unexpected errors.  
❌ MUST NOT expose stack traces, internal error messages, or Prisma error details to the client.  
❌ MUST NOT include PII in error responses.

---

## Rate Limiting

✅ MUST install `express-rate-limit` and apply it to candidate creation and file upload endpoints.  
⚠️ SHOULD set a limit of **30 requests per 15 minutes** per IP for those endpoints in MVP.

---

## PII / GDPR — Minimum Viable

✅ MUST collect only the fields defined in the user story (no extra data).  
❌ MUST NOT log any candidate PII (name, email, phone, address, CV content) in application logs.  
❌ MUST NOT include PII in error messages or HTTP responses beyond what the recruiter explicitly requested.  
⚠️ SHOULD document which fields are PII in the Prisma schema with a comment.

---

## Prisma / Database

✅ MUST use Prisma parameterized queries exclusively — never build raw SQL with user input.  
✅ MUST handle `PrismaClientKnownRequestError` (e.g. unique constraint on email) and return a `409` with a safe message.  
✅ MUST read `DATABASE_URL` from environment — never hardcode credentials.  
❌ MUST NOT commit `.env` files.

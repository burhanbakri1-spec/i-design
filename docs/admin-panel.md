# Admin Panel

The admin panel lives under `/admin` and uses the existing backend in `architecture-backend`.

## Local URLs

- Public site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin`
- Admin login: `http://localhost:3000/admin/login`
- Backend API: `http://localhost:4000/api`

## Environment

The frontend reads the backend URL from:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Security Model

- Login, refresh, logout, and session checks go through Next.js route handlers.
- Access and refresh tokens are stored in httpOnly cookies.
- Tokens are not stored in localStorage or sessionStorage.
- Admin API calls are proxied through `/api/admin-proxy/*`.
- Expired access tokens are refreshed once and retried.
- `/admin/*` is protected by middleware, while `/admin/login` remains public.
- The sidebar hides Users for non-admin users, but backend roles remain the source of truth.

## Admin Sections

- Dashboard
- Projects
- Categories
- News
- People
- Offices
- Partners
- Users
- Contact Messages

## Verification

Run these commands from the project root:

```bash
npm run type-check
npm run lint
npm run build
```

Run the backend from `architecture-backend` before testing real admin data:

```bash
npm run start:dev
```

## Actual Validation Results

Validated on July 13, 2026 with the backend running on `4000` and the frontend test instance on `3100`.

- Backend health: application up, database up.
- Swagger: available at `/api/docs`.
- Admin login: passed.
- Admin session: passed.
- Refresh with only refresh cookie: passed.
- Corrupt refresh cookie: session ended correctly.
- Logout: cookies cleared and session returned unauthenticated.
- `/admin` without a session: redirected to login.
- Tokens: not returned in login response and not stored in localStorage.
- Cookies: issued as httpOnly; production cookies are configured with `secure=true`.
- ADMIN permissions: user creation and contact deletion passed.
- EDITOR permissions: login passed; `/admin/users` returned 403.
- Contact messages: public API creation, NEW to READ to REPLIED to ARCHIVED, ADMIN delete, and EDITOR delete denial passed.

## Project Publishing Workflow

1. Log in at `/admin/login`.
2. Open Projects.
3. Create a project from `New Project`.
4. Fill title, location, year, status, descriptions, category IDs, and featured state.
5. Save the project. The slug is generated automatically when omitted.
6. Keep the project unpublished while editing.
7. Add people, partners, and awards from the project editor.
8. Use Publish when the project is ready for the public API.

Validated project:

```text
Title: Coastal Cultural Center 1783948570434
Slug: coastal-cultural-center-1783948570434
```

The project appeared in `/api/projects`, `/api/projects/featured`, and `/api/projects/<slug>` after publishing.

## Media Upload

The upload pipeline validates file type through magic bytes and rejects unsupported image types before upload.

During validation, Cloudinary variables existed as keys but were not configured with real values, so Cloudinary upload returned:

```text
503 Cloudinary is not configured
```

Do not use fake image URLs to bypass this test. Configure these backend-only variables before production media testing:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Allowed project media types:

```text
image/jpeg
image/png
image/webp
```

Configured limits:

```text
UPLOAD_MAX_FILE_SIZE_MB=10
UPLOAD_MAX_FILES=20
```

Media rules:

- File type is validated by magic bytes, not only extension or MIME header.
- SVG is not allowed.
- The upload folder is configured server-side and is not accepted from the client.
- Deletion uses the media database ID; `publicId` is read from the database and is not accepted from user input.
- Cover changes clear the previous cover and set exactly one project cover.
- Reorder accepts media IDs that belong to the same project only.

## Legacy Projects Import

Admin users can open:

```text
/admin/projects/import
```

The page reads legacy projects from `src/data/projects.ts` and `src/data/projectDetails.ts`, compares them with existing backend projects by `slug` first and `title` second, and imports through the existing REST admin API only.

Import behavior:

- Default mode is `Import as drafts`.
- `Import and publish` creates or updates first, then calls the project publish endpoint.
- Existing slugs are skipped unless `Update existing` is enabled.
- Missing categories are shown before import and can be created explicitly.
- Image URLs are reported as `Media pending migration`; no Cloudinary upload is attempted and Windows paths are never sent.
- People, partners, and awards are reported for migration review, but missing people or partners are not auto-created.
- The import runs sequentially and continues after a single project failure.
- A JSON or CSV report can be downloaded after each run.

## Production Notes

- Never put backend secrets in `NEXT_PUBLIC_*` variables.
- Keep `DATABASE_URL`, JWT secrets, admin credentials, and Cloudinary secrets only in backend environment variables.
- Run migrations before starting production.
- Seed only when a first admin account is needed.

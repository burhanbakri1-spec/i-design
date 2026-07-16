# Architecture Backend

NestJS backend for an architecture portfolio website.

## Step 1

This step creates the initial NestJS project structure, environment setup, global API prefix, CORS, Helmet, ValidationPipe, and Swagger.

## Setup

```bash
cd architecture-backend
npm install
copy .env.example .env
npm run start:dev
```

Swagger will be available at:

```text
http://localhost:4000/api/docs
```

Health check:

```text
GET http://localhost:4000/api/health
```

## Database and Prisma Setup

### Requirements

- Node.js 20.19 or newer.
- Docker Desktop for local PostgreSQL.
- npm.

### Install packages

```bash
npm install
```

If Prisma packages need to be installed manually, use:

```bash
npm install @prisma/client @prisma/adapter-pg pg dotenv
npm install --save-dev prisma tsx @types/pg
```

### Environment file

Windows Command Prompt:

```bash
copy .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Use development values only in local `.env`. Do not commit real secrets.

### Start PostgreSQL locally

```bash
npm run db:up
```

This runs PostgreSQL with:

- Database: `architecture_db`
- User: `architecture_user`
- Port: `5432`
- Persistent Docker volume: `architecture_backend_postgres_data`

Stop PostgreSQL without deleting data:

```bash
npm run db:down
```

Do not use `docker compose down -v` unless you intentionally want to delete the local database volume.

### Prisma commands

Format the schema:

```bash
npm run prisma:format
```

Validate the schema:

```bash
npm run prisma:validate
```

Create the first migration:

```bash
npx prisma migrate dev --name init_architecture_schema
```

Generate Prisma Client:

```bash
npm run prisma:generate
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

`migrate dev` is for local development and creates migration files. `migrate deploy` is for applying committed migrations in production or deployment environments. Do not use `prisma migrate reset` unless you explicitly intend to drop and recreate local data.

### Tables

The Prisma schema defines:

- `User` for admin and editor accounts.
- `Project` for portfolio projects.
- `Category` with parent and child category support.
- `ProjectCategory` as the project-category join table.
- `ProjectMedia` for project images, videos, plans, and documents.
- `Office` for studio office information.
- `Person` for team members.
- `ProjectPerson` as the project-person join table.
- `News` for articles and announcements.
- `Award` for project awards.
- `Partner` for collaborators and companies.
- `ProjectPartner` as the project-partner join table.
- `ContactMessage` for contact form messages.

### Health check with database

After installing packages, starting PostgreSQL, running migrations, and starting the app:

```text
GET http://localhost:4000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Architecture backend is running",
  "data": {
    "application": "up",
    "database": "up",
    "timestamp": "..."
  }
}
```

## Authentication and Authorization

### Run the database and migrations

```bash
npm install
copy .env.example .env
npm run db:up
npm run prisma:format
npm run prisma:validate
npx prisma migrate dev --name init_architecture_schema
npx prisma migrate dev --name add_authentication_fields
npm run prisma:generate
```

PowerShell alternative for the environment file:

```powershell
Copy-Item .env.example .env
```

If the initial migration already exists, do not create it again. Check first:

```bash
npx prisma migrate status
```

### Seed the first admin

Admin credentials come from `.env`:

```env
ADMIN_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Run:

```bash
npm run prisma:seed
```

Do not commit `.env`, JWT secrets, passwords, or generated production credentials.

### Endpoints

Public registration is not available. New users are created only by an authenticated `ADMIN`.

Login:

```http
POST http://localhost:4000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "example-password-from-env"
}
```

Use the returned access token:

```http
GET http://localhost:4000/api/auth/profile
Authorization: Bearer ACCESS_TOKEN
```

Refresh token rotation:

```http
POST http://localhost:4000/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "REFRESH_TOKEN"
}
```

Logout:

```http
POST http://localhost:4000/api/auth/logout
Authorization: Bearer ACCESS_TOKEN
```

Create a user as admin:

```http
POST http://localhost:4000/api/admin/users
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json

{
  "name": "Content Editor",
  "email": "editor@example.com",
  "password": "StrongPassword123!",
  "role": "EDITOR",
  "isActive": true
}
```

### Roles

- `ADMIN` can manage users.
- `EDITOR` can authenticate but cannot manage users.
- `DELETE /api/admin/users/:id` performs a soft delete by deactivating the account.
- Disabling a user clears the stored refresh token hash and increments `tokenVersion`.
- Changing a password clears the stored refresh token hash and increments `tokenVersion`, invalidating previous sessions.
- The system supports one active refresh token per user. Refreshing rotates it.

### Security notes

- Passwords are stored with bcrypt.
- Refresh tokens are stored as bcrypt hashes.
- Access tokens are not stored in the database.
- Login errors use a generic message.
- Swagger is available at `http://localhost:4000/api/docs` and uses the `access-token` bearer scheme.
- Generate strong secrets locally, for example with a password manager or a cryptographically secure random generator.

## Projects, Categories and Media

### Setup

```bash
npm install --fetch-timeout=600000 --fetch-retries=5
copy .env.example .env
npm run db:up
npm run prisma:format
npm run prisma:validate
npx prisma migrate dev --name add_project_soft_delete
npm run prisma:generate
npm run prisma:seed
npm run start:dev
```

PowerShell environment copy:

```powershell
Copy-Item .env.example .env
```

### Cloudinary

Set these values in `.env` before using upload routes:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_PROJECT_FOLDER=architecture-projects
UPLOAD_MAX_FILE_SIZE_MB=10
UPLOAD_MAX_FILES=20
```

Images are uploaded to Cloudinary and only URLs, metadata, and internal `publicId` values are stored in PostgreSQL. Do not commit `.env`.

### Categories

Public:

```http
GET /api/categories
GET /api/categories/tree
GET /api/categories/:slug
```

Admin/editor:

```http
GET    /api/admin/categories
GET    /api/admin/categories/:id
POST   /api/admin/categories
PATCH  /api/admin/categories/:id
```

Admin only:

```http
DELETE /api/admin/categories/:id
```

Seed creates these base categories: Architecture, Residential, Commercial, Education, Cultural, Landscape, Interior, Product Design.

### Projects

Public:

```http
GET /api/projects?page=1&limit=12&category=architecture&sortBy=year&sortOrder=desc
GET /api/projects/featured
GET /api/projects/:slug
```

Admin/editor:

```http
GET /api/admin/projects
POST /api/admin/projects
PATCH /api/admin/projects/:id
PATCH /api/admin/projects/:id/publish
PATCH /api/admin/projects/:id/unpublish
PATCH /api/admin/projects/:id/featured
```

Admin only:

```http
DELETE /api/admin/projects/:id
PATCH /api/admin/projects/:id/restore
```

Projects use automatic unique slugs such as `example-project`, `example-project-2`, and `example-project-3`. Delete is a soft delete using `deletedAt`; public routes only show published, non-deleted projects.

### Media

Admin/editor:

```http
POST /api/admin/projects/:projectId/media
POST /api/admin/projects/:projectId/media/bulk
PATCH /api/admin/media/:id
PATCH /api/admin/projects/:projectId/media/reorder
PATCH /api/admin/projects/:projectId/media/:mediaId/cover
DELETE /api/admin/media/:id
```

Single upload uses `multipart/form-data` with field `file`. Bulk upload uses field `files`.

Allowed image types:

- JPG/JPEG
- PNG
- WEBP

SVG is not allowed in this step. Files are checked with magic bytes using `file-type`, not only by extension or submitted MIME type.

### Example Project Request

```http
POST /api/admin/projects
Authorization: Bearer ADMIN_OR_EDITOR_ACCESS_TOKEN
Content-Type: application/json

{
  "title": "Example House",
  "shortDescription": "Compact residential project.",
  "city": "Copenhagen",
  "country": "Denmark",
  "year": 2026,
  "categoryIds": ["CATEGORY_CUID"]
}
```

## News, Offices, People, Awards and Partners

### News

Public:

```http
GET /api/news?page=1&limit=12&search=keyword&year=2024&featured=true&sortBy=publishedAt&sortOrder=desc
GET /api/news/featured
GET /api/news/:slug
```

Public routes only return published news where `publishedAt` is in the past. Featured endpoint returns up to 12 featured items sorted by `publishedAt` descending.

Admin/editor:

```http
GET    /api/admin/news
GET    /api/admin/news/:id
POST   /api/admin/news
PATCH  /api/admin/news/:id
PATCH  /api/admin/news/:id/publish
PATCH  /api/admin/news/:id/unpublish
PATCH  /api/admin/news/:id/featured
```

Admin only:

```http
DELETE /api/admin/news/:id
```

When creating a news item with `published: true` but no `publishedAt`, the server sets the current time automatically. Slugs are auto-generated from the title and made unique by appending `-2`, `-3`, etc.

### Offices

Public:

```http
GET /api/offices
GET /api/offices/:slug
```

An office detail page returns the office data and its published people sorted by `sortOrder`. Phone and email are not returned in public routes for privacy.

Admin/editor:

```http
GET    /api/admin/offices
GET    /api/admin/offices/:id
POST   /api/admin/offices
PATCH  /api/admin/offices/:id
```

Admin only:

```http
DELETE /api/admin/offices/:id
```

Deleting an office sets `officeId` to `null` on its people (SetNull). Latitude is validated between -90 and 90, longitude between -180 and 180.

### People

Public:

```http
GET /api/people?page=1&limit=50&search=name&office=copenhagen-studio&jobTitle=Architect&sortBy=sortOrder&sortOrder=asc
GET /api/people/:slug
```

Only published people are returned. A person detail page includes their office and published projects with role information.

Admin/editor:

```http
GET    /api/admin/people
GET    /api/admin/people/:id
POST   /api/admin/people
PATCH  /api/admin/people/:id
```

Admin only:

```http
DELETE /api/admin/people/:id
```

When assigning a person to a project, `projectId` and `personId` are validated. Duplicate assignments are rejected with a conflict error.

### Project-People Relationships

```http
POST   /api/admin/projects/:projectId/people
PATCH  /api/admin/projects/:projectId/people/reorder
DELETE /api/admin/projects/:projectId/people/:personId
```

Assign body:
```json
{
  "personId": "CUID",
  "role": "Project Architect",
  "sortOrder": 0
}
```

Reorder body:
```json
{
  "items": [
    { "personId": "CUID", "sortOrder": 0 },
    { "personId": "CUID", "sortOrder": 1 }
  ]
}
```

### Awards

Awards belong to projects.

Public:

```http
GET /api/projects/:projectSlug/awards
```

Only awards for published, non-deleted projects are returned. Awards are ordered by `year` descending then `createdAt` descending.

Admin/editor:

```http
GET    /api/admin/projects/:projectId/awards
POST   /api/admin/projects/:projectId/awards
PATCH  /api/admin/awards/:id
```

Admin only:

```http
DELETE /api/admin/awards/:id
```

The `projectId` is taken from the URL path, not the request body. The project must exist and not be deleted.

### Partners

Public:

```http
GET /api/partners
GET /api/partners/:slug
```

Admin/editor:

```http
GET    /api/admin/partners
GET    /api/admin/partners/:id
POST   /api/admin/partners
PATCH  /api/admin/partners/:id
```

Admin only:

```http
DELETE /api/admin/partners/:id
```

### Project-Partner Relationships

```http
POST   /api/admin/projects/:projectId/partners
PATCH  /api/admin/projects/:projectId/partners/reorder
DELETE /api/admin/projects/:projectId/partners/:partnerId
```

Deleting a partner removes all `ProjectPartner` relations in a transaction without deleting the projects themselves.

### Pagination

All list endpoints return:
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### Example Curl Requests (no tokens)

```powershell
curl.exe -X GET "http://localhost:4000/api/news"
curl.exe -X GET "http://localhost:4000/api/offices/copenhagen-studio"
curl.exe -X GET "http://localhost:4000/api/people"
curl.exe -X GET "http://localhost:4000/api/projects/example-project/awards"
curl.exe -X GET "http://localhost:4000/api/partners"
```

## Project Details

The `GET /api/projects/:slug` response now includes related `people` (with role and sortOrder), `awards` (sorted by year descending), and `partners` (with role and sortOrder) alongside the existing gallery and categories. Only published people are included. No sensitive fields such as `publicId` or `deletedAt` are exposed.

### Example Upload Request

```powershell
curl.exe -X POST "http://localhost:4000/api/admin/projects/PROJECT_CUID/media" `
  -H "Authorization: Bearer ADMIN_OR_EDITOR_ACCESS_TOKEN" `
  -F "file=@C:\path\to\image.webp" `
  -F "altText=Project image" `
  -F "isCover=true"
```

## Running PostgreSQL and Migrations

Docker is the preferred local path:

```bash
npm run db:up
npx prisma migrate status
npx prisma migrate dev --name init_architecture_schema
npm run prisma:generate
npm run prisma:seed
```

Do not use `prisma migrate reset` or `prisma db push` as a replacement for migrations.

## Search API

```http
GET /api/search?q=architecture
GET /api/search?q=design&types=projects,news&limit=5
```

Search only returns public-safe fields and excludes users, unpublished projects, deleted projects, unpublished news, and unpublished people.

## Contact Messages

Public submit route:

```http
POST /api/contact
```

Admin routes:

```http
GET /api/admin/contact
GET /api/admin/contact/:id
PATCH /api/admin/contact/:id/status
DELETE /api/admin/contact/:id
```

`ADMIN` and `EDITOR` can read and update status. Only `ADMIN` can delete. The public route is rate limited.

## Frontend Integration Preparation

See [docs/frontend-integration.md](docs/frontend-integration.md).

Suggested frontend variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

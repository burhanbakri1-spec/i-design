# Frontend Integration

Base API URL:

```text
http://localhost:4000/api
```

Suggested Next.js environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Response Shape

Success:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Paginated data:

```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": {
    "data": [],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

Error:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": []
}
```

## Public Routes

```text
GET /health
GET /categories
GET /categories/tree
GET /projects
GET /projects/featured
GET /projects/:slug
GET /news
GET /news/featured
GET /news/:slug
GET /offices
GET /offices/:slug
GET /people
GET /people/:slug
GET /partners
GET /partners/:slug
GET /search?q=design
POST /contact
```

## Authentication

Login:

```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password-from-env"
}
```

Use the access token:

```http
Authorization: Bearer ACCESS_TOKEN
```

Refresh:

```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "REFRESH_TOKEN"
}
```

Logout:

```http
POST /auth/logout
Authorization: Bearer ACCESS_TOKEN
```

## Project Detail Shape

```json
{
  "id": "cuid",
  "title": "Project title",
  "slug": "project-title",
  "description": "Full text",
  "categories": [],
  "gallery": [],
  "relatedProjects": []
}
```

Gallery items do not expose Cloudinary `publicId` on public routes.

## Search

```http
GET /search?q=design&types=projects,news&limit=5
```

Response:

```json
{
  "query": "design",
  "projects": [],
  "news": [],
  "people": [],
  "offices": [],
  "partners": [],
  "totals": {
    "projects": 0,
    "news": 0,
    "people": 0,
    "offices": 0,
    "partners": 0
  }
}
```

## Contact

```http
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+970000000000",
  "subject": "Project inquiry",
  "message": "I would like to discuss a project."
}
```

Rate limit: 5 contact messages per 10 minutes per tracker.

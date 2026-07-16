# API Integration

## Environment

Frontend API base URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Do not add backend secrets to the frontend. `DATABASE_URL`, JWT secrets, Cloudinary secrets, and admin credentials stay only in `architecture-backend`.

## API Client

Central client files live in:

```text
src/lib/api/client.ts
src/lib/api/types.ts
src/lib/api/projects.ts
src/lib/api/categories.ts
src/lib/api/news.ts
src/lib/api/people.ts
src/lib/api/offices.ts
src/lib/api/partners.ts
src/lib/api/search.ts
src/lib/api/contact.ts
```

`apiFetch<T>()` reads `NEXT_PUBLIC_API_URL`, unwraps the backend response shape, supports query parameters, JSON POST bodies, timeout through `AbortController`, and Next.js cache options such as `next.revalidate` and `next.tags`.

## Connected Pages

Connected now:

```text
/
/projects/architecture
/projects/interiors
/projects/landscape
/projects/planning
/projects/products
/projects/completed
/projects/france
/projects/education
/projects/museum
/projects/sustainability
/projects/[slug]
/news
/people
```

All category sub-pages that use `src/components/CategoryPage.tsx` also attempt API loading through the shared component.

## Cache And Revalidation

Project, news, people, office, partner, and category reads use short revalidation windows where they are fetched on the server. Client-side progressive reads keep the current UI stable and use the same API helpers.

## Fallback Strategy

Temporary fallback remains only for real connection failures during the migration period.

An empty successful API result is treated as a valid empty result, not as a reason to show old local projects.

Project detail `404` is treated as not found, not as a reason to show local detail data.

Still used as fallback:

```text
src/data/projects.ts
src/data/projectDetails.ts
```

The fallback keeps the existing design, images, order, animations, and routes stable only when the backend is unreachable or times out. It can be removed after the backend contains the complete public project dataset with published projects, cover images, media, categories, and project details.

Current fallback users:

```text
src/app/HomeClient.tsx
src/components/CategoryPage.tsx
src/components/ProjectSearchPage.tsx
src/app/projects/[slug]/page.tsx
src/app/projects/[slug]/ProjectDetailClient.tsx
src/app/news/page.tsx
src/app/people/page.tsx
```

API-only or API-primary pages:

```text
/
/projects/architecture
/projects/interiors
/projects/landscape
/projects/planning
/projects/products
/projects/[slug]
/news
/people
```

The project API helper no longer falls back when `/projects`, `/projects/featured`, or `/projects/<slug>` returns a valid empty or not-found response.

The homepage and main project category pages are rendered dynamically so production builds do not freeze old fallback data when the backend is unavailable during build time.

Project pages now use API data only for:

```text
/
/projects/architecture
/projects/interiors
/projects/landscape
/projects/planning
/projects/products
/projects/[slug]
```

Empty state policy:

- A successful empty API response displays an empty state.
- A project with no image displays a minimal "No image" state in the existing image frame.
- Missing awards, people, partners, or media sections are not rendered.
- Backend connection failures surface the app error UI instead of showing stale local data.

Validation after publishing the first API project:

- `/api/projects`: project returned.
- `/api/projects/featured`: project returned.
- `/api/projects/<slug>`: project returned with people, partners, and awards in the API payload.
- `/`: rendered the API project after switching the homepage to dynamic rendering.
- `/projects/<slug>`: rendered the API project, awards, people, and partners from the API response.

Remaining fallback/legacy users:

```text
src/components/BigGrid.tsx
src/components/CaseStudyView.tsx
src/components/ModernPortfolioGrid.tsx
src/components/ProjectDetailView.tsx
src/components/ProjectsGrid.tsx
src/app/projects/[slug]/[sub]/page.tsx
src/components/Navbar.tsx
src/components/MobileNavbar.tsx
```

`src/data/projectDetails.ts` was not moved to `src/data/legacy` because it is still imported by legacy components outside the completed API-only project detail route.

## Contact

The API helper is ready:

```text
src/lib/api/contact.ts
```

The current public site contact section uses mail links and office/social/legal panels, not a real contact form. No admin UI was added.

## Search

The API helper is ready:

```text
src/lib/api/search.ts
```

It supports `q`, `types`, `limit`, and abort signals. The current header search UI is still a navigation shortcut, so a full search results interface remains a later UI step.

## Images

Existing image configuration remains scoped to current image sources:

```text
images.unsplash.com
picsum.photos
media.big.dk
```

No broad remote image domain was added.

## Running Both Projects

Backend:

```powershell
cd "C:\Users\mqdad\Downloads\Documents\i-design\architecture-backend"
npm run start:dev
```

Frontend:

```powershell
cd "C:\Users\mqdad\Downloads\Documents\i-design"
npm run dev
```

Open:

```text
http://localhost:3000
```

The backend CORS setting now allows:

```text
http://localhost:3000
http://127.0.0.1:3000
```

## Legacy Projects Import

The admin import screen is available at:

```text
http://localhost:3000/admin/projects/import
```

It maps legacy data to the backend `CreateProjectDto` fields:

```text
title -> title
id/title -> slug
description -> shortDescription, description, seoDescription
location -> city, country
year -> year
projectDetails.client -> client
projectDetails.status -> status
projectDetails.size -> sizeM2, sizeFt2
category/subCategory -> categoryIds
```

The screen uses `adminApiFetch` with existing backend endpoints:

- `GET admin/projects` for duplicate comparison.
- `GET admin/categories` for category mapping.
- `POST admin/categories` only when the admin explicitly creates missing categories.
- `POST admin/projects` for new imports.
- `PATCH admin/projects/:id` for selected updates.
- `PATCH admin/projects/:id/publish` or `PATCH admin/projects/:id/unpublish` for publish mode.

Legacy images are not uploaded while Cloudinary is unconfigured. The import report keeps them as media pending migration and does not store local Windows paths.

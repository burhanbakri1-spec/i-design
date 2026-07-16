# Deployment Checklist

## Backend

- Provision production PostgreSQL.
- Set `DATABASE_URL` for production only.
- Set strong, different values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.
- Set production `FRONTEND_URL` origins for CORS.
- Configure Cloudinary:
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
  - `CLOUDINARY_PROJECT_FOLDER`
- Verify Cloudinary with a real upload before enabling media management for editors.
- Confirm allowed image types are JPG, PNG, and WEBP.
- Confirm upload limits match the backend environment:
  - `UPLOAD_MAX_FILE_SIZE_MB`
  - `UPLOAD_MAX_FILES`
- Run `npm run prisma:migrate:deploy`.
- Run `npm run prisma:seed` only when a first admin account is needed.
- Build with `npm run build`.
- Start with `npm run start:prod`.
- Verify `/api/health`.
- Verify `/api/docs` only if Swagger should be public in that environment.

## Frontend

- Set `NEXT_PUBLIC_API_URL` to the production backend `/api` URL.
- Do not put database URLs, JWT secrets, Cloudinary secrets, or admin credentials in `NEXT_PUBLIC_*`.
- Build with `npm run build`.
- Start with `npm run start`.

## Security

- Use HTTPS.
- Keep admin cookies httpOnly.
- Use `secure=true` cookies in production.
- Keep `sameSite=lax`.
- Rotate leaked secrets immediately.
- Verify `/admin/users` and all ADMIN-only operations remain backend-protected.
- Confirm login redirect only accepts safe internal paths.

## Operations

- Configure database backups.
- Monitor backend logs.
- Monitor failed logins and upload failures.
- Monitor Cloudinary usage and upload errors.
- Keep health checks active for backend and frontend.

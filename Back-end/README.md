# Clearpro-backend (Unified Admin + Doctor Portal)

Node.js + Express + Prisma + PostgreSQL backend for the Clear Pro Aligner admin dashboard **and** the Doctor Portal — in one project.

## Quick Start

1. **Install**
   ```bash
   npm i
   cp .env.example .env
   # edit DATABASE_URL, JWT_SECRET, CORS_ORIGIN if needed
   ```

2. **Prisma**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npm run seed
   npm run seed:doctor
   ```

3. **Run**
   ```bash
   npm run dev
   # API -> http://localhost:5000
   ```

## Accounts
- **Admin**: `admin@cpa.local` / `admin123`
- **Doctor**: `admin@clearproaligner.com` / `admin123`

## API Map

### Auth (Admin)
- `POST /api/auth/login`
- `POST /api/auth/register` (requires admin JWT)

### Doctor Portal Auth
- `POST /api/doctors/login`

### Doctors (Admin-managed)
- `GET /api/doctor-admin` (list)
- `POST /api/doctor-admin`
- `GET /api/doctor-admin/:id`
- `PUT /api/doctor-admin/:id`
- `DELETE /api/doctor-admin/:id`

### Patients
- `GET /api/patients`
- `POST /api/patients`
- `GET /api/patients/:id`
- `PUT /api/patients/:id`
- `DELETE /api/patients/:id`

### Cases (Admin)
- `GET /api/cases?status=APPROVED&q=CPA-2023`
- `POST /api/cases`
- `PUT /api/cases/:id/status`
- `DELETE /api/cases/:id`

### Cases (Doctor Portal)
- `POST /api/cases/submit` (multipart upload)
  - Fields: `patientName, patientEmail, patientPhone, caseType, complexity, treatmentDuration, previousTreatment, notes`
  - Files: `stlFiles[]`, `photos[]`, `xrays[]`
- `GET /api/cases/my-cases`
- `GET /api/cases/:code`

### Analytics
- `GET /api/analytics/kpis`
- `GET /api/analytics/trends`
- `GET /api/analytics/recent-activity`

## Frontend Integration

- Admin dashboard HTML can call the admin endpoints above using a bearer token from `/api/auth/login`.
- Doctor portal HTML (`doctor1.html`) should call `/api/doctors/login`, then use the doctor token for doctor case routes.
- Uploaded files are served at `/uploads/<filename>`.

## Production Notes
- Use `npm run prisma:deploy` in CI/CD.
- Configure a durable storage path for `UPLOAD_DIR` and serve `/uploads` from a CDN/reverse proxy if needed.
- Rotate `JWT_SECRET`, add rate limiting & logging, enable HTTPS.
- Consider adding real review timestamps to compute avg review time.

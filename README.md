# SpaceSync

**A room reservation and check-in management system built with Next.js, TypeScript, PostgreSQL, and Prisma.**

SpaceSync helps teams find meeting rooms, request reservations, manage approvals, and check in using QR codes. The project combines a user-facing booking workflow with an administrative dashboard and reporting tools.

**Repository:** [rizkymutia/Sistem-Booking-Ruangan](https://github.com/rizkymutia/Sistem-Booking-Ruangan)  
**Author:** [Muhammad Rizky Mutia Akbar](https://github.com/rizkymutia)

> **Demo status:** A public hosted demo has not been published in this README. The application can be run locally using the instructions below.

## Features

### For users

- Browse meeting rooms and view room details, capacity, location, and facilities.
- Choose reservation times using an interactive calendar.
- Submit booking requests and receive booking status updates.
- Receive alternative room/time recommendations when a requested slot is unavailable.
- Cancel eligible bookings before their scheduled start time.
- View an approved booking's QR code for check-in by an authorized administrator.

### For administrators

- Review and approve or reject booking requests.
- View booking summaries and room-level analytics.
- Export booking reports to Excel and PDF.
- Verify booking QR codes within the permitted check-in window.

### Booking and access rules

- New bookings start with the `PENDING` status and require an approval decision.
- Active reservations are checked for overlapping time ranges.
- Cancellation is restricted to the reservation owner and eligible statuses/time windows.
- QR check-in requires an approved booking, a valid one-time token, administrator authorization, and an eligible time window (from 15 minutes before the reservation starts until it ends).
- A successfully redeemed QR token is invalidated to prevent reuse.

## Tech stack

| Layer | Technology |
| --- | --- |
| Full-stack web | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS 4, Lucide React, Sonner |
| Database | PostgreSQL, Prisma ORM 6 |
| Authentication | JWT, password hashing with bcryptjs, role-based authorization |
| Calendar and charts | React Big Calendar, date-fns, Recharts |
| Reports | ExcelJS, PDFKit |
| QR check-in | react-qr-code, server-side token verification |
| Optional email notifications | Nodemailer |

## Application flow

```mermaid
flowchart TD
    A[User signs in] --> B[Browse rooms]
    B --> C[Choose a time slot]
    C --> D{Slot available?}
    D -- No --> E[Display alternatives]
    D -- Yes --> F[Create PENDING booking]
    E --> C
    F --> G{Admin decision}
    G -- Rejected --> H[REJECTED]
    G -- Approved --> I[APPROVED + QR token]
    F --> J[User may cancel an eligible booking]
    I --> J
    J --> K[CANCELLED]
    I --> L[Admin verifies QR at check-in]
    L --> M[CHECKED_IN]
```

## Project structure

```text
app/
  admin/                  Administrative screens
  api/                    Server-side API route handlers
  booking/                User booking history
  checkin/                QR verification screen
  dashboard/              User dashboard
  rooms/                  Room listing and detail pages
components/
  admin/                  Booking approval UI
  calendar/               Interactive room calendar
  charts/                 Analytics components
  rooms/                  Room and booking components
lib/                       Authentication, database, helpers
prisma/                    Database schema, migrations, seed data
services/                  Booking business logic
proxy.ts                   Route-level access/redirect logic
```

> Authorization is enforced in server-side route handlers as well as protected pages. Proxy redirects are not relied upon as the sole security boundary.

## Local development

### Prerequisites

- Node.js compatible with Next.js 16 (Node.js 20.9+)
- npm
- PostgreSQL database

### Setup

**1. Clone the repository**

```bash
git clone https://github.com/rizkymutia/Sistem-Booking-Ruangan.git
cd Sistem-Booking-Ruangan
```

**2. Install dependencies**

```bash
npm ci
```

**3. Configure environment variables**

Create a `.env` file in the project root. See the included `.env.example` template (or copy the sample below):

```env
DATABASE_URL="postgresql://DB_USER:DB_PASSWORD@localhost:5432/spacesync?schema=public"
JWT_SECRET="REPLACE_WITH_A_LONG_RANDOM_SECRET"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Needed only when enabling Gmail-based notifications
EMAIL_USER=""
EMAIL_PASS=""
```

Never commit `.env`, real credentials, or real participant/booking data. For local development, generate a cryptographically random value for `JWT_SECRET`, for example:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

**4. Prepare the database**

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

The seed operation inserts sample meeting rooms while skipping entries whose unique room codes already exist. Use a **local/test database** for seeding and experiments.

**5. Start the app**

```bash
npm run dev
```

Open **http://localhost:3000**. Register a test account for the user workflow. Administrator access should be provisioned deliberately in a controlled local database; do not expose default administrator passwords or public registration of privileged roles.

## Quality checks

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Manual scenarios exercised during development include authorization for booking management, cancellation, validation of reservation dates and overlaps (including concurrent requests), and QR check-in rules. These are **manual functional checks**, not a claim of an automated test suite or a third-party security assessment.

## Screenshots

The screenshots below illustrate the user and administrator flows using demonstration data. Images are stored under `docs/screenshots/`.

### Home page

![SpaceSync home page](docs/screenshots/01-home.png)

### Room listing

![Available meeting rooms](docs/screenshots/02-rooms.png)

### Room details and booking calendar

![Room details and reservation calendar](docs/screenshots/03-booking-calendar.png)

### Booking history and cancellation

![Booking history and cancellation controls](docs/screenshots/04-booking-history.png)

### Administration dashboard

![Administrator dashboard and booking management](docs/screenshots/05-admin-dashboard.png)

### QR check-in

![QR check-in interface with demo data](docs/screenshots/06-qr-checkin.png)

> Screenshot file names above must match the files committed to `docs/screenshots/` exactly. Use non-sensitive demonstration data only, and never publish active QR tokens, personal details, or private administrator information.

## Deployment and security notes

- Use HTTPS and a properly configured `NEXT_PUBLIC_APP_URL` in deployed environments.
- Configure authentication secrets and SMTP credentials only through private environment variables.
- QR codes contain bearer-style tokens; sharing or photographing a valid QR may allow someone else to present it. Administrators must check the attendee's identity when appropriate.
- Run scheduled email reminders through a dedicated scheduler or background job for production; a scheduler started from a Next.js layout is not a reliable serverless deployment pattern.
- Review database backup, logging, and automated testing requirements before using the application with real organizational data.

## Author

**Muhammad Rizky Mutia Akbar**  
GitHub: [@rizkymutia](https://github.com/rizkymutia)  
Email: [rizkyjepara11@gmail.com](mailto:rizkyjepara11@gmail.com)

<p align="center">
  <img src="client/public/AstraHealth.png" alt="AstraHealth Logo" width="80" />
</p>

<h1 align="center">AstraHealth</h1>

<p align="center">
  <strong>A comprehensive patient-side health portal for managing appointments, consultations, medications, vitals, medical records, and family dependents.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2-black?logo=next.js" />
  <img src="https://img.shields.io/badge/NestJS-11-red?logo=nestjs" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?logo=clerk" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" />
</p>

---

## Overview

AstraHealth is a full-stack health management portal built for patients. It provides a modern, responsive UI for everyday health workflows — booking doctor consultations, tracking medications, logging vitals, managing medical records, and registering for community health campaigns — all backed by a real API server and database.

The platform operates in **two modes**:
- **Live Mode** — Connected to the NestJS backend with persistent SQLite storage.
- **Demo Mode** — Runs entirely on in-memory mock data with zero server dependency. If the backend is unreachable, the app automatically falls back to demo mode.

---

## Features

| Module | Description |
|---|---|
| **Dashboard** | Overview of upcoming appointments, active medications, recent vitals, and health goals |
| **Consultations** | Browse doctors, schedule video/voice/chat consultations, view history |
| **Appointments** | Book, reschedule, and cancel appointments with calendar views |
| **Medications** | Track active prescriptions, dose reminders, refills, and completion |
| **Medical Records** | View consultation reports, lab results, prescriptions, and attachments |
| **Vitals Logger** | Manually log heart rate, blood pressure, SpO2, temperature, blood sugar, and weight with trend charts |
| **Health Campaigns** | Browse community health drives (vaccination, blood donation, checkups) and register dependents |
| **Family Members** | Add and manage dependent profiles (spouse, children, parents) |
| **Health Bot** | AI-powered health assistant chat (OpenAI integration) |
| **Education** | Health education modules and progress tracking |
| **Hospital Finder** | Search nearby hospitals and clinics |
| **Onboarding** | Multi-step setup wizard for new users with demo data auto-fill |
| **Settings** | Profile management, notification preferences, and data source toggle |

---

## Tech Stack

### Frontend (`/client`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Authentication**: [Clerk](https://clerk.com/) (frontend SDK)
- **Language**: TypeScript

### Backend (`/server`)
- **Framework**: [NestJS 11](https://nestjs.com/)
- **ORM**: [Prisma 6](https://www.prisma.io/)
- **Database**: [SQLite](https://www.sqlite.org/) (zero-config, file-based)
- **Auth Verification**: [Clerk Backend SDK](https://clerk.com/docs/references/backend/overview) (JWT verification)
- **Webhook Signing**: [Svix](https://www.svix.com/) (Clerk webhook signature verification)
- **Language**: TypeScript

---

## Project Structure

```
AstraHealth/
├── client/                     # Next.js frontend
│   ├── app/                    # App Router pages
│   │   ├── dashboard/          # Main dashboard
│   │   ├── consultations/      # Doctor consultations
│   │   ├── appointments/       # Appointment booking
│   │   ├── medicine/           # Medication tracking
│   │   ├── records/            # Medical records
│   │   ├── health-streak/      # Vitals logger & trends
│   │   ├── health-campaigns/   # Campaign registration
│   │   ├── health-bot/         # AI health assistant
│   │   ├── onboarding/         # New user setup wizard
│   │   ├── settings/           # User preferences
│   │   └── ...
│   ├── components/             # Reusable UI components
│   ├── hooks/                  # Custom React hooks
│   │   └── use-data-source.tsx # Live/Demo mode toggle
│   ├── lib/                    # Data services & adapters
│   │   ├── data-service.ts     # Unified async data layer
│   │   ├── api-adapter.ts      # REST client for backend
│   │   └── data.ts             # Mock/dummy data arrays
│   └── public/                 # Static assets
│
├── server/                     # NestJS backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (15 models)
│   │   ├── seed.ts             # Database seeder
│   │   └── dev.db              # SQLite database file (auto-generated)
│   └── src/
│       ├── users/              # Profile & onboarding API
│       ├── family-members/     # Dependents CRUD
│       ├── appointments/       # Appointments CRUD
│       ├── consultations/      # E-consultations CRUD
│       ├── medications/        # Medications CRUD
│       ├── records/            # Medical records CRUD
│       ├── vitals/             # Vitals logging API
│       ├── support/            # Campaigns, goals, feedback
│       ├── webhooks/           # Clerk webhook receiver
│       ├── prisma/             # Database connection service
│       └── common/             # Auth guard & decorators
│
└── .gitignore
```

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- A [Clerk](https://clerk.com/) account (free tier works) for authentication

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Akash-Shaw1/Astrahealth.git
cd Astrahealth
```

### 2. Set up the frontend

```bash
cd client
npm install
```

Create a `.env.local` file in `client/`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
```

### 3. Set up the backend

```bash
cd ../server
npm install
```

Create a `.env` file in `server/`:
```env
DATABASE_URL="file:./dev.db"
CLERK_SECRET_KEY="sk_test_your_key"
CLERK_WEBHOOK_SECRET="whsec_your_webhook_secret"
PORT=4000
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
```

### 4. Initialize the database

```bash
npx prisma db push
npx prisma db seed
```

### 5. Run both services

**Terminal 1 — Backend:**
```bash
cd server
npm run start:dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The app works without the backend running. If the server is unreachable, it automatically falls back to demo mode with mock data.

---

## Database

AstraHealth uses **SQLite** via Prisma. The database is a single file (`server/prisma/dev.db`) that is automatically created when you run `prisma db push`. No external database server is required.

**Schema models:** User, FamilyMember, Doctor, Appointment, Consultation, MedicalRecord, Medication, VitalsEntry, HealthCampaign, CampaignRegistration, Feedback, ChatSession, ChatMessage, HealthGoal, EducationProgress.

To switch to PostgreSQL for production, change the provider in `schema.prisma` and update `DATABASE_URL`.

---

## API Endpoints

All backend routes are prefixed with `/api` and require a valid Clerk JWT (except webhooks and health check).

| Method | Route | Purpose |
|--------|-------|---------|
| `GET` | `/api/health` | Server health check |
| `POST` | `/api/webhooks/clerk` | Clerk user sync webhook |
| `GET` | `/api/users/profile` | Get current user profile |
| `PUT` | `/api/users/profile` | Update profile |
| `POST` | `/api/users/onboarding` | Complete onboarding |
| `GET/POST/PUT/DELETE` | `/api/family-members` | Dependents CRUD |
| `GET/POST/PUT/DELETE` | `/api/appointments` | Appointments CRUD |
| `GET/POST` | `/api/consultations` | Consultations management |
| `GET/POST/DELETE` | `/api/records` | Medical records |
| `GET/POST/PUT/DELETE` | `/api/medications` | Medications CRUD |
| `GET/POST/DELETE` | `/api/vitals` | Vitals logging |
| `GET` | `/api/support/campaigns` | List health campaigns |
| `POST` | `/api/support/campaigns/:id/register` | Register for campaign |
| `POST` | `/api/support/feedback` | Submit feedback |

---

## License

This project is for educational and demonstration purposes.

---


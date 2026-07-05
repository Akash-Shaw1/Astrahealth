<p align="center">
  <img src="client/public/AstraHealth.png" alt="AstraHealth Logo" width="100" />
</p>

<h1 align="center">AstraHealth Patient Portal</h1>

<p align="center">
  <strong>A premium, full-stack Patient-Side Health Portal with a NestJS backend, Prisma ORM, SQLite database, Clerk authentication, and dynamic data-source toggling.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/NestJS-11.0-E0234E?style=for-the-badge&logo=nestjs" />
  <img src="https://img.shields.io/badge/Prisma-6.19-2D3748?style=for-the-badge&logo=prisma" />
  <img src="https://img.shields.io/badge/SQLite-3.0-003B57?style=for-the-badge&logo=sqlite" />
  <img src="https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" />
</p>

---

## 🌟 Key Highlights

*   **Dual-Mode Data Layer**: Seamlessly switch between **Live Mode** (NestJS REST API server + local SQLite database) and **Demo Mode** (in-memory simulation with zero dependencies).
*   **Auto-Fallback & Recovery**: The client dynamically checks server health (`GET /api/health`). If the connection drops or times out, it gracefully downgrades to Demo Mode, displaying descriptive toast updates. A settings panel allows developers/users to retry the connection.
*   **Resilient Clerk Authentication**: Utilizes the `@clerk/backend` SDK for token verification in a custom Guard. Includes a lazy-provisioning fallback mechanism that automatically registers user profile nodes if Clerk webhooks are delayed.
*   **SQLite Cross-Compatibility**: Fully optimized for local development. Array and metadata fields (such as `knownConditions`, `allergies`, and `reminderTimes`) are stored as JSON strings and automatically serialized/deserialized transparently in the services, ensuring easy portability to production PostgreSQL or MySQL instances.
*   **✨ Interactive Demo Fill**: A developer-friendly injector is added to all input-heavy forms (such as onboarding, vitals logging, appointments, medications, and medical records). Clicking **✨ Demo** pre-populates fields with randomized, realistic health metrics, enabling immediate testing and fluid client presentations.

---

## 🛠️ Tech Stack

### Frontend Client
*   **Framework**: Next.js 15.2 (App Router, Server & Client Components)
*   **Authentication**: Clerk NextJS SDK (session token retrieval via vanilla Clerk window instance)
*   **Design System**: Custom CSS variables + Tailwind CSS 4 + Radix UI + shadcn/ui
*   **Visualizations**: Recharts (fully responsive patient vitals graphs and health trends)
*   **State Management**: Context-based `DataSourceProvider` with localStorage states

### Backend Server
*   **Framework**: NestJS 11.0 (Express, dependency injection, and controller-driven modules)
*   **ORM**: Prisma 6.19 (Type-safe client generation, migrations, and declarative modeling)
*   **Database**: SQLite (local single-file storage, zero extra system dependencies)
*   **Webhook Signing**: Svix (secure verification of Clerk user sync payloads)

---

## 📁 Directory Structure

```
AstraHealth/
├── client/                     # Next.js Frontend Application
│   ├── app/                    # Page components & routing endpoints
│   │   ├── onboarding/         # 5-step Patient Wizard setup flow
│   │   ├── health-streak/      # Vitals logger (replacing hardcoded IoT telemetry)
│   │   ├── health-campaigns/   # Public campaigns read-only browser & registration
│   │   ├── settings/           # Profile settings & developer data controls
│   │   └── ...
│   ├── components/             # Custom UI widgets (my-medicines-modal, calendar-modal, etc.)
│   ├── hooks/                  # Global context hooks (use-data-source.tsx, etc.)
│   └── lib/                    # API Adapters and mock data definitions
│       ├── api-adapter.ts      # HTTP REST client referencing backend
│       └── data-service.ts     # Unified async facade for client-side queries
│
└── server/                     # NestJS Backend API Server
    ├── prisma/
    │   ├── schema.prisma       # Database definitions & SQLite schema mappings
    │   ├── seed.ts             # Seeder script parsing client JSON arrays
    │   └── dev.db              # Auto-generated SQLite local database file
    └── src/
        ├── common/             # Clerk JWT verification guard & decorators
        ├── webhooks/           # Clerk webhook controller verifying signatures with Svix
        └── [resource]/         # Resource modules (users, appointments, vitals, etc.)
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Akash-Shaw1/Astrahealth.git
cd Astrahealth
```

### 2. Configure Environment variables

Create a `.env.local` inside `/client`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
```

Create a `.env` inside `/server`:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
CORS_ORIGIN="http://localhost:3000"
```

### 3. Initialize & Seed Database
Build the Prisma Client and seed the database with mock records (12 doctors, 6 public campaigns, and 16 reviews):
```bash
cd server
npm install
npx prisma db push
npx prisma db seed
```

### 4. Start Development Servers

**Run Backend Server:**
```bash
cd server
npm run start:dev
```
Verify the health check endpoint: `GET http://localhost:4000/api/health` should respond with `{ "status": "ok" }`.

**Run Frontend Client:**
```bash
cd client
npm install
npm run dev
```

Visit `http://localhost:3000` to interact with the application.

---

## ⚡ API Endpoints

All backend routes are prefixed with `/api` and require a valid Clerk Bearer JWT in the Authorization header.

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/health` | Server status health check (Public) |
| `POST` | `/api/webhooks/clerk` | Clerk User sync listener (Public, verified via Svix) |
| `GET` | `/api/users/profile` | Retrieves current user profile |
| `PUT` | `/api/users/profile` | Updates user settings & notification preferences |
| `POST` | `/api/users/onboarding` | Submits onboarding wizard forms |
| `GET/POST` | `/api/family-members` | Retrieves & registers family dependents |
| `GET/POST` | `/api/appointments` | Lists & creates appointments |
| `GET/POST` | `/api/consultations` | Lists & schedules consultations |
| `GET/POST/DELETE` | `/api/vitals` | Logs and manages user/dependent vitals |
| `GET/POST` | `/api/medications` | Manages medications, doses, and refills |

---

## 🛡️ Database Schema

The SQLite schema maps 15 core entities:
*   **User**: Personal details, onboarding progress, preferred hospital, and insurance policies.
*   **FamilyMember**: Registered dependents tracking relationships, known conditions, and allergies.
*   **Doctor**: Professional records, rating aggregates, and scheduled slots.
*   **Appointment** & **Consultation**: Booking states, notes, severity indicators, and prescription lists.
*   **Medication**: Active courses, dosage instructions, remaining quantities, and reminder triggers.
*   **VitalsEntry**: Heart rate, temperature, weight, SpO2, blood pressure, and blood sugar records.
*   **HealthCampaign** & **CampaignRegistration**: Event tracking for immunization drives, wellness programs, and registration states.
*   **Feedback**: Patient reviews and general suggestions.

To migrate the schema to PostgreSQL or MySQL, update the `provider` line in `schema.prisma` and swap your connection string in `.env`.

---

## 📝 License
This codebase is licensed under the MIT License. For a detailed guide on page workflows, testing configurations, and troubleshooting steps, read the **[USAGE.md](./USAGE.md)**.

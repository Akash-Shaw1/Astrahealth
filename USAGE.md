# Usage Guide

A hands-on guide for using every feature of the AstraHealth patient portal.

---

## Table of Contents

1. [First-Time Setup (Onboarding)](#1-first-time-setup-onboarding)
2. [Dashboard](#2-dashboard)
3. [Consultations](#3-consultations)
4. [Appointments](#4-appointments)
5. [Medications](#5-medications)
6. [Medical Records](#6-medical-records)
7. [Vitals Logger](#7-vitals-logger)
8. [Health Campaigns](#8-health-campaigns)
9. [Family Members](#9-family-members)
10. [Health Bot](#10-health-bot)
11. [Settings & Data Mode](#11-settings--data-mode)
12. [Demo Fill Feature](#12-demo-fill-feature)
13. [Running the Backend](#13-running-the-backend)
14. [Database Management](#14-database-management)
15. [Clerk Webhook Setup](#15-clerk-webhook-setup)

---

## 1. First-Time Setup (Onboarding)

When you sign up via Clerk for the first time, you'll be redirected to the **Onboarding Wizard** — a 5-step form that sets up your patient profile.

| Step | What You Fill |
|------|--------------|
| **Step 1** — Personal Info | Date of birth, gender, phone, blood group, address, emergency contact |
| **Step 2** — Family Members | Add dependents (spouse, children, parents) with their medical details |
| **Step 3** — Medical Profile | Known conditions, allergies, preferred hospital, insurance details |
| **Step 4** — Preferences | Interface language, notification toggles (appointment, medication, campaign alerts) |
| **Step 5** — Review & Confirm | Review all entered data, then submit |

> **Tip:** Press the **✨ Demo Fill** button at the top-right of steps 1–3 to auto-populate all fields with realistic sample data. This is useful for demos and presentations.

After completing onboarding, you're taken to the dashboard.

---

## 2. Dashboard

The dashboard is the central hub showing:

- **Upcoming Appointments** — Next scheduled doctor visit with time and type.
- **Active Medications** — Current prescriptions with remaining doses.
- **Latest Vitals** — Most recent heart rate, blood pressure, and SpO2 readings.
- **Health Goals** — Progress on active wellness targets.
- **Quick Actions** — Shortcut buttons to book appointments, log vitals, or start a consultation.

---

## 3. Consultations

Navigate to **Consultations** from the sidebar.

### Browsing Doctors
- View a directory of available doctors with specialties, ratings, and availability.
- Filter by specialty (Cardiology, Dermatology, General Medicine, etc.).

### Scheduling a Consultation
1. Click **Schedule Consultation**.
2. Select a doctor from the list.
3. Pick a date on the calendar — available time slots appear automatically.
4. Choose consultation type (Video Call, Voice Call, or Chat).
5. Enter your reason for visit and severity level.
6. Optionally attach files (reports, images).
7. Click **Confirm Booking**.

### Viewing History
- Past consultations show the doctor's notes, prescriptions, and any follow-up dates.

---

## 4. Appointments

Navigate to **Appointments** from the sidebar.

- **Calendar View** — See all booked appointments on a monthly calendar.
- **Book New** — Click "Book Appointment" and follow the guided flow.
- **Manage** — Reschedule or cancel upcoming appointments.
- **Status Tracking** — Appointments show as Upcoming, Completed, or Cancelled.

---

## 5. Medications

Navigate to **Medicine** from the sidebar.

### Active Medications
- See all current prescriptions with dosage, frequency, and remaining doses.
- **Take Dose** — Click the pill button to decrement remaining doses.
- **Refill** — Add more doses when you pick up a refill.
- **Complete** — Mark a medication course as finished.

### Adding a Medication
1. Click **Add Medicine**.
2. Fill in name, dosage, frequency, purpose, and total doses.
3. Enable/disable dose reminders.
4. Save.

### Editing & Deleting
- Click the edit icon on any medication card to modify details.
- Click delete to permanently remove it.

---

## 6. Medical Records

Navigate to **Records** from the sidebar, or click the records button on the dashboard.

- **Search** — Filter records by title, type, or content.
- **Categories** — Toggle between All, Consultation Reports, and Lab Results.
- **Record Details** — Click any record to see:
  - Diagnosis and severity
  - Clinical findings
  - Treatment plan
  - Prescriptions with dosage details
  - Attached documents (downloadable)
  - Follow-up dates

---

## 7. Vitals Logger

Navigate to **Vitals** (Health Streak) from the sidebar.

### Logging a Reading
1. Select which family member the reading is for (dropdown at top-right).
2. Fill in any combination of: Heart Rate, Blood Pressure (systolic/diastolic), Temperature, SpO2, Blood Sugar, Weight.
3. Add optional notes (e.g., "Post-walk reading").
4. Set the date/time (defaults to now).
5. Click **Log Vitals Entry**.

### Viewing Trends
- The **trend chart** plots heart rate, systolic BP, and SpO2 over the past 30 days.
- The **readings table** shows all logged entries with delete capability.

### Quick Indicators
- Five color-coded cards at the top show the most recent reading for each metric.

> **Tip:** Use the **Fill Demo** button to generate randomized healthy vitals for presentations.

---

## 8. Health Campaigns

Navigate to **Health Campaigns** from the sidebar.

### Browsing Campaigns
- View community health drives — vaccination drives, blood donation camps, wellness programs, and health checkups.
- Filter by campaign type or search by title/description.

### Registering
1. Select which family member to register (dropdown at top-right).
2. Click **Register Dependent** on any campaign card.
3. The card updates to show a "Registered" badge.

### Cancelling
- Click **Cancel Registration** on any campaign you've registered for.

### My Registrations
- The right sidebar shows all your active registrations with quick cancel links.

---

## 9. Family Members

Family members (dependents) are added during onboarding but can also be managed from:
- **Settings > Profile** — View and edit dependent information.
- **Onboarding Step 2** — Add dependents during initial setup.

Each dependent has their own:
- Name, relationship, date of birth, gender
- Known conditions and allergies
- Blood group

Dependents appear in dropdowns across the app (vitals logging, campaign registration, etc.).

---

## 10. Health Bot

Navigate to **Health Bot** from the sidebar.

- Type health-related questions in natural language.
- The AI assistant (powered by OpenAI) provides empathetic, evidence-based guidance.
- **Important:** The bot is informational only — it does not diagnose or prescribe.

> Requires a valid `OPENAI_API_KEY` in the client `.env.local` file.

---

## 11. Settings & Data Mode

Navigate to **Settings** from the sidebar.

### Profile Tab
- View your Clerk account details (name, email, avatar — synced from Clerk, read-only).
- Edit your phone number, date of birth, gender, blood group, address, and emergency contact.
- Click **Save Profile Changes** to persist.

### Data Source Toggle
- The **Developer & Data Source Connection** card shows whether you're in **Live** or **Demo** mode.
- **Live Mode**: All data reads/writes go to the NestJS backend + SQLite database.
- **Demo Mode**: All data comes from in-memory mock arrays. Changes are not persisted.
- **Auto-Fallback**: If you set Live mode but the server is unreachable, the app automatically falls back to Demo mode and shows a toast notification.
- Use the **Retry Connection** button to manually re-check server availability.

### Header Indicator
- A small pill in the top header bar shows the current connection status:
  - 🟢 **Connected** — Live mode, server reachable.
  - 🟡 **Demo Mode** — Using mock data.

---

## 12. Demo Fill Feature

The **✨ Demo Fill** button appears on:
- Onboarding wizard (Steps 1–3)
- Vitals logger form
- Any other input-heavy forms

Pressing it instantly populates all fields with realistic sample data. This is designed for:
- **Demos and presentations** — Show a fully populated portal without typing.
- **Development testing** — Quickly create test entries.
- **Showcasing** — Impress stakeholders with a data-rich UI.

Each press cycles through different demo data profiles, so you can fill forms multiple times with different values.

---

## 13. Running the Backend

The backend is optional — the app works in Demo mode without it.

### Start the server

```bash
cd server
npm install              # First time only
npx prisma db push       # Create/sync database tables (first time only)
npx prisma db seed       # Populate with sample doctors & campaigns (first time only)
npm run start:dev        # Start in watch mode on port 4000
```

### Verify it's running

Open [http://localhost:4000/api/health](http://localhost:4000/api/health) — you should see `{ "status": "ok" }`.

### Stop the server

Press `Ctrl+C` in the terminal.

---

## 14. Database Management

### Where is the database?

The SQLite database file is at `server/prisma/dev.db`. It is auto-created by Prisma.

### View the database

Use [Prisma Studio](https://www.prisma.io/studio) — a visual database browser:

```bash
cd server
npx prisma studio
```

This opens a browser GUI at [http://localhost:5555](http://localhost:5555) where you can browse, edit, and delete records in every table.

### Reset the database

To wipe all data and start fresh:

```bash
cd server
rm prisma/dev.db          # Delete the database file
npx prisma db push        # Recreate empty tables
npx prisma db seed        # Re-seed with sample data
```

### Switch to PostgreSQL

1. Change `provider` in `server/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in `server/.env`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/astrahealth"
   ```
3. Run `npx prisma db push` to create tables in PostgreSQL.

---

## 15. Clerk Webhook Setup

For the backend to automatically sync new user signups from Clerk:

1. Go to your [Clerk Dashboard](https://dashboard.clerk.com/) → **Webhooks**.
2. Add a new endpoint:
   - **URL**: `https://your-domain.com/api/webhooks/clerk` (or use [ngrok](https://ngrok.com/) for local dev: `https://xxxx.ngrok.io/api/webhooks/clerk`)
   - **Events**: Select `user.created`, `user.updated`, `user.deleted`.
3. Copy the **Signing Secret** (starts with `whsec_`).
4. Set it in `server/.env`:
   ```env
   CLERK_WEBHOOK_SECRET="whsec_your_actual_secret"
   ```
5. Restart the server.

> **Note:** Even without webhooks configured, the auth guard has a resilient fallback — if a Clerk user hits the API but doesn't exist in the local database yet, the guard auto-creates their profile on-the-fly.

---

## Common Workflows

### "I want to demo the app to someone"
1. Run only the frontend: `cd client && npm run dev`
2. Sign in with Clerk.
3. Complete onboarding using **✨ Demo Fill** on every step.
4. Browse the dashboard — everything works with mock data.

### "I want to test with real persistent data"
1. Start the backend: `cd server && npm run start:dev`
2. In the app, go to **Settings** and toggle to **Live Mode**.
3. All changes now persist in the SQLite database.

### "I want to start with a clean database"
```bash
cd server
rm prisma/dev.db
npx prisma db push
npx prisma db seed
```

---

*For API endpoint details and schema documentation, see the [BACKEND_REQUIREMENTS.md](./BACKEND_REQUIREMENTS.md) file.*

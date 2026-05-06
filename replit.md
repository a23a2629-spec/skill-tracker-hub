# In-Campus Skills Gap Tracker

A web app for university staff and students to track skills gaps, manage appointments, view assessments, and communicate — with separate dashboards for students and lecturers.

## Run & Operate

- **Dev server**: `npm run dev` (runs Vite on port 5000)
- **Build**: `npm run build`
- **Tests**: `npm test` (Vitest unit tests)
- No environment variables required — all data is stored in localStorage

## Stack

- **Framework**: React 18
- **Build tool**: Vite 5 with `@vitejs/plugin-react-swc`
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v3 + shadcn/ui components (Radix UI primitives)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **State**: TanStack React Query (QueryClientProvider wrapper)
- **Language**: TypeScript 5

## Where things live

- `src/App.tsx` — root providers and router
- `src/pages/Index.tsx` — main app logic, session handling, dashboard routing
- `src/components/` — all UI components (Login, Signup, StudentDashboard, LecturerDashboard, etc.)
- `src/components/ui/` — shadcn/Radix-based UI primitives
- `src/data/mockData.ts` — seed/mock data (students, courses, skills, appointments)
- `src/lib/userRegistry.ts` — localStorage-based registration and auth helpers
- `src/lib/utils.ts` — Tailwind `cn` utility

## Architecture decisions

- Auth is entirely client-side using localStorage (no backend server or external auth provider)
- All user data (sessions, registrations, reports, chat) persisted to localStorage under `skills-tracker-*` keys
- Demo credentials are hardcoded in mockData for quick access without registration
- Role-based rendering: `Index.tsx` conditionally shows `StudentDashboard` or `LecturerDashboard` based on session role

## Product

- Student login/signup with matric number
- Student dashboard: profile, modules, skills/assessments, appointments, case tracking, messaging, analytics, reports
- Lecturer dashboard: cohort management, academic management (faculties/courses), appointments, problems, reports, AI insights, messaging

## User preferences

_Populate as you build_

## Gotchas

- All data is local to the browser — clearing localStorage resets all user data
- Demo student password is `student123` for any matric number in the system
- Vite dev server must bind to `0.0.0.0` and port `5000` for Replit preview to work

## Pointers

- Vite config: `vite.config.ts`
- Tailwind config: `tailwind.config.ts`
- Mock data: `src/data/mockData.ts`
- User registry (auth): `src/lib/userRegistry.ts`

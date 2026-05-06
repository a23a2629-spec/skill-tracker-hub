# In-Campus Skills Gap Tracker

Role-based SPA for Students and Lecturers to track skills gaps, manage appointments, reports, and communicate via in-app chat.

## Run & Operate
```
npm run dev      # dev server on port 5000
npm run build    # production build
```
No required env vars — all data is localStorage-only.

## Stack
- React 18 + TypeScript, Vite 5
- Tailwind CSS + shadcn/ui
- React Router DOM v6
- TanStack React Query, React Hook Form + Zod
- Recharts

## Where things live
- `src/pages/Index.tsx` — auth gate, all shared state & handlers
- `src/components/StudentDashboard.tsx` — student role shell + all student sections
- `src/components/LecturerDashboard.tsx` — lecturer role shell + all lecturer sections
- `src/components/StudentProfile.tsx` — tabbed profile/skills detail
- `src/data/mockData.ts` — all types + seed data (source of truth for data model)
- `src/lib/userRegistry.ts` — localStorage-based user registration

## Architecture decisions
- No backend: all state lives in `localStorage` with typed JSON parse/stringify in `useState` initialisers
- Role is determined at login; `Index.tsx` branches between `<StudentDashboard>` and `<LecturerDashboard>`
- All `useState` hooks in `Index.tsx` must appear **before** the `if (!session)` early return (previous crash lesson)
- Chat `threadId = studentId + "|" + contactName`; single shared array passed top-down via props
- Reports: Lecturer creates `ReportTemplate`; student uploads `ReportSubmission`; lecturer reviews with notes

## Product
- **Student**: Dashboard, Profile (skills/modules/integrity), Cohort, Contacts (in-app chat), Cases, Meetings, Reports (file upload), AI, Settings
- **Lecturer**: Dashboard, Students, Analytics, Appointments, Cases, Reports (create + review), Messages (chat inbox + reply), AI Insights, Academic Management, Settings

## Chat Feature
- `ChatMessage` type: `{ id, threadId, studentId, studentName, contactName, senderRole, body, timestamp, read }`
- Student opens a chat panel per contact card (Dr. Zainab, Dr. Ahmad Ridzuan, Counselling Office); unread badge on button
- Lecturer sees unified Messages inbox: thread list (left) + reply panel (right); red badge on nav item for unread count
- Persisted to `localStorage` key `skills-tracker-chat-messages`

## User preferences
- Keep existing file/component structure; do not introduce a backend
- Demo credentials: students use `student123`, lecturers use `lecturer123`

## Gotchas
- All `useState` in `Index.tsx` must be before the `if (!session)` guard
- Vite needs `server.allowedHosts: true` for the Replit proxy iframe

## Pointers
- shadcn/ui docs: https://ui.shadcn.com
- React Router v6: https://reactrouter.com/en/main

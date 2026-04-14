# Project Overview

This is a React + Vite + TypeScript frontend application migrated from Lovable to Replit.

## Stack
- **Framework**: React 18 with TypeScript
- **Build tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router DOM v6
- **State/Data**: TanStack React Query
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts

## Development

Run the app:
```
npm run dev
```
The app runs on port 5000 and is accessible via the Replit preview pane.

## Build & Deploy

Build for production:
```
npm run build
```

## Project Structure

- `src/` — All application source code
  - `pages/` — Route-level page components
  - `components/` — Reusable UI components (shadcn/ui + custom)
  - `hooks/` — Custom React hooks
  - `lib/` — Utility functions
  - `data/` — Static data files
- `public/` — Static assets

## Notes

- Migrated from Lovable: removed `lovable-tagger` dev dependency usage from vite config
- Vite dev server configured for Replit: `host: "0.0.0.0"`, `port: 5000`, `allowedHosts: true`

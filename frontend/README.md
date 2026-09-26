# Rosterly frontend

The Rosterly marketing site and authenticated scheduling dashboard, built with Next.js 16.3.5 App Router, React 19.2.8, TypeScript, Tailwind CSS 4, and GSAP.

## Getting started

Use Bun 1.3.3. From `frontend/`:

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard requires a running backend and database; see the repository README for database and Docker Compose setup.

## Configuration

The only frontend API setting is the server-only `API_URL`. Create `frontend/.env.local`:

```dotenv
API_URL=http://localhost:8000
```

Use the API origin without an endpoint suffix. Next.js route handlers read `API_URL` at runtime and proxy account and roster requests, so it may use an internal address such as `http://backend:8000` under Docker Compose. Browser code never receives this value or the backend session token. Restart the development server after changing the environment file.

## Authentication and dashboard

- Signup, login, and logout use same-origin Next.js route handlers.
- Login stores the backend token in an httpOnly `session_token` cookie.
- `/dashboard` requires that cookie. Roster requests go through `/api/roster/[...path]`; the server attaches the Bearer token to backend requests.
- The dashboard loads and persists the workspace, team members, weekly rosters, manual shifts, publishing state, and time-off requests.
- Manual shift edits save the whole weekly roster through `saveRoster`, so they replace the saved shift set for that week.

## Scheduling drafts

1. In **My team**, use **Scheduling** for each member to set qualified roles and recurring weekday availability.
2. For an unpublished week, select **Build draft**, enter one or more open shifts, and choose **Generate draft**.
3. Generation only returns a preview. It lists generated shifts and any unfilled demand; it does not persist or publish a roster.
4. Select **Apply draft and save roster** only after review. This explicitly overwrites that week&apos;s saved roster with the draft&apos;s existing manual shifts plus generated shifts. Review the resulting roster before publishing.

Draft generation is unavailable for published rosters. Existing manual shift, time-off, export, and publishing flows remain available.

## Project layout

```text
app/
  api/                Same-origin auth and roster proxy route handlers
  dashboard/          Authenticated roster UI, dialogs, and scheduling draft review
  components/         Shared marketing components
lib/
  api.ts              Required server-only API URL helper
  auth.ts             Session cookie and authenticated backend fetch helper
  roster-client.ts    Browser client for same-origin roster endpoints
types/roster/         Backend roster, profile, and draft contract types
```

## Commands

Run from `frontend/`:

| Command | Purpose |
| --- | --- |
| `bun install` | Install dependencies using `bun.lock` |
| `bun run dev` | Start development server on port 3000 |
| `bun run lint` | Run ESLint |
| `bunx tsc --noEmit` | Check TypeScript types |
| `bun run build` | Create a production build |
| `bun run start` | Serve an existing production build |

There is no frontend test script. Run lint and type checking for frontend changes.

## Contributor guidance

Read [AGENTS.md](AGENTS.md) before changing Next.js code. Version-specific Next.js documentation is installed with Next under `node_modules/next/dist/docs/` when available.

# Rosterly frontend

The Rosterly marketing website, account forms, and demo scheduling dashboard, built with Next.js 16.3.5 App Router, React 19.2.8, TypeScript, Tailwind CSS 4, and GSAP.

For database, backend, and Docker Compose setup, see the [repository README](../README.md).

## Getting started

Use Bun 1.3.3, as declared in `package.json`. Run these commands from `frontend/`:

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). Pages update as you edit them. The marketing pages can be viewed independently of the backend; account submissions require the API and database.

## Pages

| Route | Content |
| --- | --- |
| `/` | Landing page with a demo roster preview |
| `/product` | Product overview and feature previews |
| `/how-it-works` | Scheduling workflow overview |
| `/signup` | Name, email, and password signup form |
| `/login` | Email and password login form |
| `/dashboard` | Demo scheduling dashboard: weekly roster, open shifts, leave requests, and week insights |

The roster previews and dashboard use static demo data. Dashboard edits are client-side only and reset on refresh; no scheduling data is persisted to the API yet.

## API configuration

`lib/api.ts` exposes two helpers, both of which throw when their variable is missing — there is no fallback address:

- `getApiUrl()` reads `NEXT_PUBLIC_API_URL` for browser requests (the signup form).
- `getServerApiUrl()` reads `API_URL` for server-to-server calls from route handlers.

Create `.env.local` in this directory:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
API_URL=http://localhost:8000
```

Use the API origin without an endpoint suffix. `NEXT_PUBLIC_API_URL` must be reachable from the user's browser; `API_URL` is only read on the server and can use an internal address such as `http://backend:8000` in Docker Compose. Restart the development server after changing either value.

Next.js embeds `NEXT_PUBLIC_API_URL` during `bun run build`, so it is fixed at build time; the Dockerfile accepts it as a `NEXT_PUBLIC_API_URL` build argument. `API_URL` is read at runtime.

### Account flow status

- **Signup:** sends `{ name, email, password }` to `POST /users/`, then navigates to `/login` on success. This request runs in the browser against `NEXT_PUBLIC_API_URL`.
- **Login:** posts `{ email, password }` to the same-origin `POST /api/auth/login` route handler. The handler calls the backend's `POST /auth/login/`, sets the returned token in an httpOnly `session_token` cookie, and the form navigates to `/dashboard`. The token is never exposed to browser JavaScript.
- **Authenticated requests:** `lib/auth.ts` reads the cookie, and `backendFetch()` attaches `Authorization: Bearer <token>` when the Next.js server calls the backend.
- **Logout:** the dashboard's "Log out" button posts to `/api/auth/logout`, which clears the cookie.
- Both forms include pending and error states and password visibility controls. Signup requires an eight-character password and acceptance of the terms in the browser.
- Signup still needs CORS or a same-origin proxy to work against a separate API origin; login avoids this because it is proxied through Next.js.
- Google sign-in, password recovery, and server-side session validation are unfinished. The backend does not yet validate tokens on every request, and the dashboard is not auth-gated.

## Project layout

```text
app/
  api/auth/login/     Login route handler (calls the backend, sets the session cookie)
  api/auth/logout/    Logout route handler (clears the session cookie)
  components/         Shared header, footer, and page animations
  dashboard/          Demo scheduling dashboard (client component, roster table, dialogs, sample data)
  how-it-works/       Workflow overview page
  login/              Login page and client-side form
  product/            Product overview page
  signup/             Signup page and client-side form
  globals.css         Global styles and Tailwind imports
  layout.tsx          Root layout and font configuration
  page.tsx            Landing page
lib/
  api.ts              Required API base URL helpers (browser and server)
  auth.ts             Server-side session cookie and Bearer request helper
public/               Static assets
next.config.ts        Next.js configuration
```

## Commands

Run from `frontend/`:

| Command | Purpose |
| --- | --- |
| `bun install` | Install dependencies using `bun.lock` |
| `bun run dev` | Start the development server on port `3000` |
| `bun run lint` | Run ESLint |
| `bunx tsc --noEmit` | Check TypeScript types |
| `bun run build` | Create a production build |
| `bun run start` | Serve an existing production build |

There is no frontend test script at present. Run lint, type checking, and a production build when validating frontend changes.

## Contributor guidance

Read [AGENTS.md](AGENTS.md) before changing Next.js code. Version-specific Next.js documentation is available after installing dependencies under `node_modules/next/dist/docs/`.

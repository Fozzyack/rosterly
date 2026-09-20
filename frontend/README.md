# Rosterly frontend

The Rosterly marketing website and account forms, built with Next.js 16.3.5 App Router, React 19.2.8, TypeScript, Tailwind CSS 4, and GSAP.

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

The roster and team previews use static demo data. The app does not yet provide a working scheduling dashboard.

## API configuration

`lib/api.ts` reads `NEXT_PUBLIC_API_URL`, removes trailing slashes, and defaults to `http://localhost:8000` when the variable is unset.

To override it, create `.env.local` in this directory:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Use the API origin without an endpoint suffix. Requests run in the browser, so the address must be reachable from the user's browser. Restart the development server after changing the value.

Next.js embeds this public variable during `bun run build`. Changing it only when starting a production container does not update the browser bundle. The current Dockerfile builds without an explicit API URL build argument, so its default is `http://localhost:8000` unless a value is available during the build.

### Account flow status

- **Signup:** sends `{ name, email, password }` to `POST /users/`, then navigates to `/login` on success.
- **Login:** sends `{ email, password }` to `POST /login`, then navigates to `/` on success. The backend has a login handler, but `/login` is not registered yet.
- Both forms include pending and error states and password visibility controls. Signup requires an eight-character password and acceptance of the terms in the browser.
- Browser requests to the separate API origin currently need CORS support or a same-origin proxy; neither is configured yet.
- Google sign-in, password recovery, and session handling are unfinished.

## Project layout

```text
app/
  components/         Shared header, footer, and page animations
  how-it-works/       Workflow overview page
  login/              Login page and client-side form
  product/            Product overview page
  signup/             Signup page and client-side form
  globals.css         Global styles and Tailwind imports
  layout.tsx          Root layout and font configuration
  page.tsx            Landing page
lib/
  api.ts              Shared API base URL helper
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

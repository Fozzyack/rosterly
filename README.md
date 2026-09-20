<p align="center">
  <img src="rosterly-banner.svg" alt="Rosterly - Your week, sorted." width="1200">
</p>

> Rosterly was based on a hackathon project built during the 2026 WADSIH Hackathon.

Simple, automated roster scheduling for small teams.

Rosterly is in early development. The repository currently contains a marketing website, signup and login forms, a demo scheduling dashboard, and a Go API with PostgreSQL-backed user creation, password login, and session storage. The dashboard and scheduling views use demo data; automated scheduling and persistence of roster edits are not implemented yet.

## Stack

- **Frontend:** Next.js 16.3.5, React 19.2.8, TypeScript, Tailwind CSS 4, and GSAP; managed with Bun 1.3.3.
- **Backend:** Go 1.27.1, Chi, pgx, Goose migrations, bcrypt, and zerolog.
- **Database:** PostgreSQL 17.
- **Local infrastructure:** Docker Compose.

## Repository layout

```text
backend/
  main.go             HTTP server entrypoint
  internal/           API handlers, routing, models, stores, auth, and configuration
  migrations/         Embedded SQL migrations applied at startup
frontend/
  app/                App Router pages, account forms, demo dashboard, shared components, and styles
  lib/                Shared API URL and server-side session helpers
  public/             Static assets
compose.yaml          Database, API, and web services
graphify-out/         Generated codebase knowledge graph
```

See the [frontend README](frontend/README.md) for pages, UI development, and browser API configuration.

## Run with Docker Compose

Install Docker with the Compose plugin. From the repository root:

1. Create `backend/.env` from [backend/.env.example](backend/.env.example), if it does not already exist.
2. Set its contents for the Compose database:

   ```dotenv
   DATABASE_URL=postgresql://rosterly:rosterly@db:5432/rosterly?sslmode=disable
   ENV=development
   ```

   **The example currently uses the password `rostlerly`, while `compose.yaml` uses `rosterly`.** The URL above matches Compose. An existing database may have different credentials from its initial creation.

3. Start the database, wait until it accepts connections, then build and start the stack:

   ```bash
   docker compose up -d db
   docker compose exec db pg_isready -U rosterly -d rosterly
   docker compose up --build
   ```

   If the readiness check fails, repeat it once PostgreSQL has finished starting. Compose currently has no database healthcheck or readiness condition, and the API runs migrations immediately on startup.

| Service | Address |
| --- | --- |
| Website | http://localhost:3000 |
| API health | http://localhost:8000/health/ |
| PostgreSQL | `localhost:5432` |

The backend Dockerfile copies `backend/.env` into the image, so the file must exist before building. Rebuild the backend after changing it. The API listens on port `8000`, despite the Dockerfile's `EXPOSE 8080` declaration. Compose passes `NEXT_PUBLIC_API_URL=http://localhost:8000` (browser bundle, supplied as a build arg) and `API_URL=http://backend:8000` (server-to-server) to the web service.

Stop the stack with `docker compose down`.

## Local development

Install Go 1.27.1 and Bun 1.3.3. Use PostgreSQL 17 locally or start the Compose database with `docker compose up -d db`.

### Backend

Create `backend/.env` if needed and use a host-accessible database URL:

```dotenv
DATABASE_URL=postgresql://rosterly:rosterly@localhost:5432/rosterly?sslmode=disable
ENV=development
```

From `backend/`:

```bash
go run .
```

The server defaults to port `8000`; use `go run . -port 8001` to override it. Startup requires a readable `.env` file and an available database. Goose automatically applies the embedded migrations in `backend/migrations/`, including the users and sessions tables.

### Frontend

From `frontend/`:

```bash
bun install
bun run dev
```

Open http://localhost:3000. Both API URLs are required — the helpers in `lib/api.ts` throw when a variable is missing. Create `frontend/.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
API_URL=http://localhost:8000
```

`NEXT_PUBLIC_API_URL` is read in the browser (the signup form still posts directly to the API) and is embedded into the browser bundle at build time, so restart or rebuild after changing it. `API_URL` is server-only and is used by the Next.js route handlers when they call the API, so it can point at an internal address such as `http://backend:8000` under Compose.

## API and current integration status

The router currently registers these endpoints (including trailing slashes):

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health/` | Health response |
| `POST` | `/auth/login/` | Authenticate with email and password; creates a 24-hour session and returns its token |
| `POST` | `/users/` | Create a user with a bcrypt password hash |

Example requests:

```bash
curl http://localhost:8000/health/

curl -i http://localhost:8000/users/ \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alex Carter","email":"alex@example.com","password":"example-password"}'

curl -i http://localhost:8000/auth/login/ \
  -H 'Content-Type: application/json' \
  -d '{"email":"alex@example.com","password":"example-password"}'
```

User creation returns HTTP `201` with the user's name, email, and timestamps. Login returns a session token that expires after 24 hours; sessions are persisted in the `sessions` table.

Current frontend integration status:

- The signup form posts to `/users/` and redirects to `/login` on success.
- The login form posts to the same-origin `/api/auth/login` route handler, which calls the backend's `/auth/login/`, stores the returned token in an httpOnly `session_token` cookie, and redirects to `/dashboard`. Server-side requests to the backend attach the token as `Authorization: Bearer <token>` through `lib/auth.ts`. Logging out clears the cookie via `/api/auth/logout`. The backend does not yet validate tokens on every request, and the dashboard is not auth-gated.
- The token never reaches browser JavaScript: the cookie is httpOnly and the backend is called from the Next.js server.
- The dashboard is a client-side demo workspace with static sample data; edits reset on refresh.
- The signup form still posts directly from the browser to port `8000`, so it needs CORS or a same-origin proxy; the backend has no CORS middleware. Login no longer has this problem because it runs through the Next.js server. Direct API requests such as `curl` are unaffected.
- Google sign-in and password recovery are not wired into the UI flow.

## Development checks

From `backend/`:

```bash
go build ./...
go vet ./...
go test ./...
```

From `frontend/`:

```bash
bun run lint
bunx tsc --noEmit
bun run build
```

There is currently no frontend test script or CI workflow. Contributor guidance lives in [AGENTS.md](AGENTS.md) and [frontend/AGENTS.md](frontend/AGENTS.md).

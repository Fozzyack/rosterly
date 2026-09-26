<p align="center">
  <img src="rosterly-banner.svg" alt="Rosterly - Your week, sorted." width="1200">
</p>

> Rosterly was based on a hackathon project built during the 2026 WADSIH Hackathon.

Simple, automated roster scheduling for small teams.

Rosterly is in early development. The repository contains a marketing website, signup and login forms, an authenticated scheduling dashboard, and a Go API with PostgreSQL-backed workspace roster persistence. Automated scheduling is not implemented yet.

## Stack

- **Frontend:** Next.js 16.3.5, React 19.2.8, TypeScript, Tailwind CSS 4, and GSAP; managed with Bun 1.3.3.
- **Backend:** Go 1.27.1, Chi, pgx, Goose migrations, bcrypt, and zerolog.
- **Database:** PostgreSQL 17.
- **Local infrastructure:** Docker Compose.

## Repository layout

```text
backend/
  cmd/seed-user/      Idempotent test-user seed command
  main.go             HTTP server entrypoint
  internal/           API handlers, routing, models, stores, auth, and configuration
  migrations/         Embedded SQL migrations applied at startup
frontend/
  app/                App Router pages, account forms, dashboard, shared components, and styles
  lib/                Shared server-side session and roster helpers
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

3. Build and start the stack:

   ```bash
   docker compose up --build
   ```

   Compose waits for PostgreSQL to pass its `pg_isready` healthcheck before starting the backend and web services. The API applies migrations at startup.

| Service | Address |
| --- | --- |
| Website | http://localhost:3000 |
| API health | http://localhost:8000/health/ |
| PostgreSQL | `localhost:5432` |

The backend Dockerfile copies `backend/.env` into the image, so the file must exist before building. Compose overrides its `DATABASE_URL` with the database service address, so a host-local `.env` URL cannot be used inside the backend container. The API listens on and exposes port `8000`. Compose supplies `API_URL=http://backend:8000` for server-to-server requests from the web service.

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

The server defaults to port `8000`; use `go run . -port 8001` to override it. Startup requires a readable `.env` file and an available database. Goose automatically applies the embedded migrations in `backend/migrations/`, including users, sessions, workspaces, team members, rosters, and time-off requests.

Seed a local test user with the same database configuration:

```bash
go run ./cmd/seed-user
```

This creates `Test User` (`test@example.com`, password `test-password`) if the email does not already exist. Override any value with `-name`, `-email`, or `-password`.

### Frontend

From `frontend/`:

```bash
bun install
bun run dev
```

Open http://localhost:3000. Frontend route handlers require `API_URL`; create `frontend/.env.local`:

```dotenv
API_URL=http://localhost:8000
```

`API_URL` is server-only and is used by the Next.js route handlers for signup, login, and roster requests, so it can point at an internal address such as `http://backend:8000` under Compose.

## API and current integration status

The router currently registers these endpoints (including trailing slashes):

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health/` | Health response |
| `POST` | `/auth/login/` | Authenticate with email and password; creates a 24-hour session and returns its token |
| `POST` | `/users/` | Create a user with a bcrypt password hash |
| `GET` | `/workspace/` | Get the authenticated user's workspace and team members |
| `GET`, `POST` | `/team-members/` | List or create workspace team members |
| `PUT`, `DELETE` | `/team-members/{memberID}/` | Update or remove a workspace team member |
| `GET`, `PUT` | `/rosters/{monday}/` | Read or replace a weekly manual roster |
| `POST` | `/rosters/{monday}/publish/` | Publish a weekly roster |
| `POST` | `/rosters/{monday}/unpublish/` | Unpublish a weekly roster |
| `GET`, `POST` | `/time-off/` | List or create workspace time-off requests |
| `POST` | `/time-off/{requestID}/review/` | Approve or reject a time-off request |

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

User creation validates required fields, returns `409` for a duplicate email, and creates a default workspace with owner membership. Login returns `401` for invalid credentials and otherwise returns a session token that expires after 24 hours. All workspace, team, roster, and time-off endpoints require `Authorization: Bearer <token>`, are scoped to the authenticated user's workspace, and use trailing slashes. Roster weeks must be Monday `yyyy-mm-dd` values; writes reject unknown team members, blank roles, overlapping shifts, invalid times, and shifts on approved time off.

Replace a roster with a payload such as:

```bash
curl -X PUT http://localhost:8000/rosters/2026-04-06/ \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{"shifts":[{"team_member_id":"<member-id>","date":"2026-04-06","start":"09:00","end":"17:00","role":"Cashier"}]}'
```

Current frontend integration status:

- Signup and login use same-origin Next.js route handlers. Login stores its backend session token in an httpOnly `session_token` cookie, and logout clears it.
- The dashboard redirects visitors without a session cookie to `/login`. Its server-side proxy attaches the session as `Authorization: Bearer <token>` for workspace, roster, team, and time-off operations.
- Dashboard changes to team members, shifts, roster publication, and time-off requests persist in the authenticated workspace. The token never reaches browser JavaScript.
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

There is currently no frontend test script. GitHub Actions runs the backend checks and frontend lint, typecheck, and production build. Contributor guidance lives in [AGENTS.md](AGENTS.md) and [frontend/AGENTS.md](frontend/AGENTS.md).

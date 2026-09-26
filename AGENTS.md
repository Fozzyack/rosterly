# rosterly

Simple roster scheduling for small teams. The repository includes a marketing site, authenticated workspace setup, and persisted manual roster management.

## Structure

- `backend/` is a Go module whose path is `github.com/Fozzyack/rosterly/m` (trailing `/m` is intentional). Entrypoint `backend/main.go` defaults to port `8000` (`-port` overrides).
- Backend layout: `internal/api` handlers, `internal/store` pgx stores, `internal/models`, `internal/auth`, `internal/routes` (Chi), `internal/app` (opens the DB and runs migrations).
- `frontend/` is Next.js `16.3.5` / React `19.2.8` (Bun `1.3.3`). App Router code is in `frontend/app/`; the shared API base URL helper is `frontend/lib/api.ts`.
- `backend/migrations/*.sql` are embedded via `migrations/fs.go` and applied by Goose at backend startup; there is no separate migration command.

## Commands

- Backend, from `backend/`: `go run .`, `go build ./...`, `go vet ./...`, `go test ./...`. Tests are unit-only with in-memory store mocks, so they do not need Postgres (`go run .` does).
- Frontend, from `frontend/`: `bun install`, `bun run dev`, `bun run lint`, `bunx tsc --noEmit`, `bun run build`; there is no test script.
- Full stack, from the repository root: `docker compose up --build` (Compose waits for the database healthcheck before starting dependent services).

## Gotchas

- Every Chi route is registered with a trailing slash (`/health/`, `/auth/login/`, `/users/`); requests without it 404.
- The backend has no CORS middleware. Frontend auth and roster requests use same-origin Next.js route handlers, which attach the httpOnly session token to backend requests.
- `backend/.env` is gitignored and required: `go run .` exits without it, and `backend/Dockerfile` copies it into the image at build time (so it must exist before a Compose build).
- `.env.example` uses password `rostlerly`; Compose uses `rosterly`. Use `rosterly` for the Compose/local database.
- `API_URL` is server-only and is used by Next.js route handlers. Under Compose it must use the internal backend address, `http://backend:8000`.

## Workflow

- No CI, Makefile, or pre-commit; use the focused commands above. `README.md` is the detailed setup/status reference — keep it in sync when behavior changes.
- Commit completed changes incrementally. Before each commit, inspect `git status`, the relevant diff, and recent commit history; stage only the intended files.
- Read `frontend/AGENTS.md` before changing Next.js code; keep its generated marker block and consult `frontend/node_modules/next/dist/docs/` for this version's behavior.
- Do not hand-edit generated `graphify-out/`, `.next/`, or `node_modules/` content.
- For codebase questions prefer `graphify query "..."` (graph at `graphify-out/graph.json`; use `graphify-out/wiki/index.md` when present) over grepping, and use `graphify path` / `graphify explain` for focused lookups. After code changes run `graphify update .`; dirty `graphify-out/` files are expected.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

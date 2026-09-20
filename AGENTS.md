# rosterly

## Structure

- `backend/` is a Go 1.27 HTTP API. Its module path is `github.com/Fozzyack/rosterly/m` (the trailing `/m` is intentional); `backend/main.go` is the entrypoint and defaults to port `8000` (`-port` overrides it).
- `frontend/` is a Next.js `16.3.5` / React 19 app using Bun `1.3.3`; App Router code lives in `frontend/app/` and uses `NEXT_PUBLIC_API_URL` for API calls.
- `compose.yaml` runs PostgreSQL 17, the backend, and the frontend on ports `5432`, `8000`, and `3000`.
- `backend/migrations/*.sql` are embedded and applied automatically by Goose during backend startup; there is no separate migration command.

## Commands

- Backend, from `backend/`: `go run .`, `go build ./...`, `go vet ./...`, `go test ./...`.
- Frontend, from `frontend/`: `bun install`, `bun run dev`, `bun run lint`, `bunx tsc --noEmit`, `bun run build`; there is no frontend test script.
- Full stack, from the repository root: `docker compose up --build`.

## Setup Constraints

- Local backend startup requires `backend/.env`; start from `backend/.env.example` and provide `DATABASE_URL` (and optionally `ENV`). The backend exits if `.env` cannot be loaded or the database is unavailable.
- The backend Dockerfile copies `backend/.env` during image build, so create that ignored file before running Compose as well.
- Compose and `.env.example` use the database password `rostlerly` (not `rosterly`).
- `backend/Dockerfile` declares `EXPOSE 8080`, but the server and Compose use `8000`; trust the server and Compose values.
- Read `frontend/AGENTS.md` before changing Next.js code. Keep its generated marker block and consult the version-specific docs under `frontend/node_modules/next/dist/docs/`.

## Workflow

- There is no CI, Makefile, task runner, or pre-commit configuration; use the commands above for focused verification.
- Do not hand-edit generated `graphify-out/`, `.next/`, or `node_modules/` content.
- When `/graphify` is requested, use the installed graphify skill first. For codebase questions, run `graphify query "..."` when `graphify-out/graph.json` exists; use `graphify path` or `graphify explain` for focused lookups. After code changes, run `graphify update .`.
- Dirty `graphify-out/` files are expected; do not skip graph queries or updates because they are dirty. Use `graphify-out/wiki/index.md` for broad navigation when present.

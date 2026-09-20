# rosterly

Simple roster scheduling app. Two services + a database, orchestrated by root `compose.yaml`:
- `backend/` — Go 1.27 HTTP API (chi router, zerolog logging, godotenv). Module path is `github.com/Fozzyack/rosterly/m` — note the trailing `/m`; all imports use it. Entrypoint: `backend/main.go` (listens on `:8000`, overridable with `-port`).
- `frontend/` — Next.js 16 + React 19 + Tailwind 4, package manager is **bun** (`bun.lock`, `packageManager: bun@1.3.3`). App Router code in `frontend/app/`. Calls the API via `NEXT_PUBLIC_API_URL=http://localhost:8000`.
- `db` — postgres:17-alpine (compose only; no migrations or DB code exist yet).

## Commands

- Backend (run from `backend/`): `go run .` — requires `backend/.env` to exist or the server exits on startup (`godotenv.Load` is fatal). `go build ./...`, `go vet ./...`, `go test ./...` (no tests yet). There is no Makefile or task runner.
- Frontend (run from `frontend/`): `bun install`, `bun run dev`, `bun run lint` (eslint), `bun run build`. There is no test or typecheck script — typecheck via `bunx tsc --noEmit`.
- Full stack: `docker compose up --build` from repo root. No CI, no pre-commit hooks.

## Gotchas

- `frontend/AGENTS.md` (auto-maintained by `next dev`) warns this is Next.js 16 with breaking changes vs training data — check `node_modules/next/dist/docs/` before writing Next.js code. Don't strip its marker comments from diffs.
- DB password in `compose.yaml` is `rostlerly` (a typo, not `rosterly`) — the `DATABASE_URL` uses it too. Match it exactly when connecting manually.
- `backend/Dockerfile` says `EXPOSE 8080` but the server defaults to port 8000; compose maps `8000:8000`, so trust compose, not the Dockerfile.
- `graphify-out/`, `.next/`, and `node_modules/` are generated — never edit by hand.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

# Graph Report - backend  (2026-09-26)

## Corpus Check
- 28 files · ~5,284 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 190 nodes · 495 edges · 11 communities (9 shown, 2 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ee2e55c7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- context.Context
- NewApplication
- user_handler_test.go
- net/http.ResponseWriter
- seed-user/main.go
- 00003_create_roster.sql
- User
- auth.go
- AuthMiddleware
- go_pkg_embed
- github.com/Fozzyack/rosterly/m

## God Nodes (most connected - your core abstractions)
1. `RosterHandler` - 17 edges
2. `sendError()` - 14 edges
3. `sendJSON()` - 12 edges
4. `PostgresStore` - 12 edges
5. `NewApplication()` - 11 edges
6. `decodeRequest()` - 10 edges
7. `Application` - 10 edges
8. `AuthMiddleware()` - 8 edges
9. `rosterTestStore` - 8 edges
10. `UserHandler` - 8 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `NewApplication()`  [EXTRACTED]
  main.go → internal/app/app.go
- `main()` --calls--> `HashPassword()`  [EXTRACTED]
  cmd/seed-user/main.go → internal/auth/auth.go
- `main()` --calls--> `MigrateDB()`  [EXTRACTED]
  cmd/seed-user/main.go → internal/database/database.go
- `main()` --calls--> `Open()`  [EXTRACTED]
  cmd/seed-user/main.go → internal/database/database.go
- `main()` --calls--> `NewUserStore()`  [EXTRACTED]
  cmd/seed-user/main.go → internal/store/user_store.go

## Import Cycles
- None detected.

## Communities (11 total, 2 thin omitted)

### Community 0 - "context.Context"
Cohesion: 0.11
Nodes (19): authSessionStore, loginSessionStore, rosterTestStore, context.Context, time.Time, RosterResponse, Shift, TeamMember (+11 more)

### Community 1 - "NewApplication"
Cohesion: 0.12
Nodes (29): main(), go_pkg_github_com_fozzyack_rosterly_m_internal_env, go_pkg_github_com_jackc_pgx_v5_stdlib, go_pkg_github_com_pressly_goose_v3, go_pkg_io_fs, database/sql.DB, github.com/rs/zerolog.Logger, io/fs.FS (+21 more)

### Community 2 - "user_handler_test.go"
Cohesion: 0.20
Nodes (19): contextKey, go_pkg_context, go_pkg_crypto_sha256, go_pkg_database_sql, go_pkg_encoding_json, go_pkg_errors, go_pkg_github_com_fozzyack_rosterly_m_internal_auth, go_pkg_github_com_fozzyack_rosterly_m_internal_models (+11 more)

### Community 3 - "net/http.ResponseWriter"
Cohesion: 0.36
Nodes (8): net/http.Request, net/http.ResponseWriter, decodeRequest(), RosterHandler, weekStart(), decodeJSON(), sendError(), sendJSON()

### Community 4 - "seed-user/main.go"
Cohesion: 0.12
Nodes (17): chi.Mux, go_pkg_flag, go_pkg_fmt, go_pkg_github_com_fozzyack_rosterly_m_internal_api, go_pkg_github_com_fozzyack_rosterly_m_internal_app, go_pkg_github_com_fozzyack_rosterly_m_internal_database, go_pkg_github_com_fozzyack_rosterly_m_internal_routes, go_pkg_github_com_fozzyack_rosterly_m_migrations (+9 more)

### Community 5 - "00003_create_roster.sql"
Cohesion: 0.23
Nodes (13): users, idx_sessions_expires_at, idx_sessions_user_id, sessions, idx_roster_shifts_workspace_date, idx_team_members_workspace_id, idx_time_off_workspace_dates, roster_shifts (+5 more)

### Community 6 - "User"
Cohesion: 0.25
Nodes (6): loginUserStore, NewUserRequest, User, PostgresStore, LoginRequest, UserResponse

### Community 7 - "auth.go"
Cohesion: 0.33
Nodes (5): go_pkg_crypto_rand, go_pkg_encoding_hex, go_pkg_golang_org_x_crypto_bcrypt, CheckPasswordHash(), GenerateToken()

### Community 8 - "AuthMiddleware"
Cohesion: 0.40
Nodes (5): net/http.Handler, AuthMiddleware(), bearerToken(), TestAuthMiddleware(), UserIDFromContext()

## Knowledge Gaps
- **4 isolated node(s):** `github.com/Fozzyack/rosterly/m`, `contextKey`, `TimeOffReviewRequest`, `LoginRequest`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 20 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `RosterHandler` connect `net/http.ResponseWriter` to `NewApplication`, `user_handler_test.go`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `Application` connect `NewApplication` to `net/http.ResponseWriter`, `seed-user/main.go`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `loginSessionStore` connect `context.Context` to `NewApplication`, `user_handler_test.go`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `github.com/Fozzyack/rosterly/m`, `contextKey`, `TimeOffReviewRequest` to the rest of the system?**
  _4 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `context.Context` be split into smaller, more focused modules?**
  _Cohesion score 0.11149825783972125 - nodes in this community are weakly interconnected._
- **Should `NewApplication` be split into smaller, more focused modules?**
  _Cohesion score 0.11693548387096774 - nodes in this community are weakly interconnected._
- **Should `seed-user/main.go` be split into smaller, more focused modules?**
  _Cohesion score 0.1225296442687747 - nodes in this community are weakly interconnected._
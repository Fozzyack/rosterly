# Graph Report - rosterly  (2026-09-22)

## Corpus Check
- 57 files · ~17,478 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 6, .css 2, .example 1)

## Summary
- 328 nodes · 574 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `83cf51ff`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- TypeScript Compiler Configuration
- NewApplication
- fs.go
- README.md
- dashboard.tsx
- user_handler_test.go
- layout.tsx
- graphify.js
- pricing/page.tsx
- .LoginUser
- opencode.json
- postcss.config.mjs
- github.com/Fozzyack/rosterly/m
- auth.ts
- context.Context

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Dashboard()` - 15 edges
3. `next` - 15 edges
4. `NewApplication()` - 9 edges
5. `UserHandler` - 8 edges
6. `Application` - 8 edges
7. `Session` - 8 edges
8. `SessionStore` - 8 edges
9. `AuthMiddleware()` - 7 edges
10. `NewUserHandler()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `MigrateDB()`  [EXTRACTED]
  cmd/seed-user/main.go → internal/database/database.go
- `main()` --calls--> `Open()`  [EXTRACTED]
  cmd/seed-user/main.go → internal/database/database.go
- `main()` --calls--> `NewUserStore()`  [EXTRACTED]
  cmd/seed-user/main.go → internal/store/user_store.go
- `API configuration` --references--> `getApiUrl()`  [INFERRED]
  frontend/README.md → frontend/lib/api.ts
- `API configuration` --references--> `getServerApiUrl()`  [INFERRED]
  frontend/README.md → frontend/lib/api.ts

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (38): eslintConfig, dependencies, gsap, @gsap/react, next, react, react-dom, devDependencies (+30 more)

### Community 1 - "TypeScript Compiler Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "NewApplication"
Cohesion: 0.09
Nodes (31): HealthHandler, NewHealthHandler(), UserHandler, NewUserHandler(), Application, NewApplication(), MigrateDB(), Open() (+23 more)

### Community 4 - "README.md"
Cohesion: 0.09
Nodes (20): Commands, Gotchas, rosterly, Structure, Workflow, This is NOT the Next.js you know, Commands, Contributor guidance (+12 more)

### Community 5 - "dashboard.tsx"
Cohesion: 0.10
Nodes (34): Dashboard(), deleteShift(), exportRoster(), notify(), reviewRequest(), saveShift(), updateWeek(), dateLabel() (+26 more)

### Community 6 - "user_handler_test.go"
Cohesion: 0.11
Nodes (28): contextKey, TestAuthMiddleware(), UserIDFromContext(), TestLoginUserSession(), go_pkg_context, go_pkg_crypto_sha256, go_pkg_database_sql, go_pkg_errors (+20 more)

### Community 7 - "layout.tsx"
Cohesion: 0.33
Nodes (4): frontend_app_globals, geistMono, geistSans, metadata

### Community 8 - "graphify.js"
Cohesion: 0.40
Nodes (3): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path

### Community 9 - "pricing/page.tsx"
Cohesion: 0.08
Nodes (21): PageAnimations(), SiteFooter(), LogoMark(), SiteHeader(), SiteHeaderProps, availability, checks, metadata (+13 more)

### Community 11 - ".LoginUser"
Cohesion: 0.16
Nodes (16): main(), AuthMiddleware(), bearerToken(), decodeJSON(), sendError(), sendJSON(), CheckPasswordHash(), GenerateToken() (+8 more)

### Community 23 - "auth.ts"
Cohesion: 0.22
Nodes (12): POST(), SignupForm(), handleSubmit(), getApiUrl(), getServerApiUrl(), requireApiUrl(), backendFetch(), getSessionToken() (+4 more)

### Community 24 - "context.Context"
Cohesion: 0.17
Nodes (13): authSessionStore, loginSessionStore, loginUserStore, Session, NewUserRequest, User, PostgresStore, hashSessionToken() (+5 more)

## Knowledge Gaps
- **93 isolated node(s):** `$schema`, `plugin`, `github.com/Fozzyack/rosterly/m`, `contextKey`, `LoginRequest` (+88 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 136 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `pricing/page.tsx` to `package.json`, `layout.tsx`, `dashboard.tsx`, `auth.ts`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Why does `API configuration` connect `auth.ts` to `README.md`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `Rosterly frontend` connect `README.md` to `auth.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `$schema`, `plugin`, `github.com/Fozzyack/rosterly/m` to the rest of the system?**
  _93 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `NewApplication` be split into smaller, more focused modules?**
  _Cohesion score 0.08708708708708708 - nodes in this community are weakly interconnected._
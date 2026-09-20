# Graph Report - rosterly  (2026-09-20)

## Corpus Check
- 40 files · ~8,184 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 6, .example 1, .ico 1)

## Summary
- 243 nodes · 316 edges · 25 communities (17 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `afaf8bab`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- TypeScript Compiler Configuration
- main.go
- fs.go
- Next.js Project
- layout.tsx
- devDependencies
- Graphify Knowledge Graph
- graphify.js
- how-it-works/page.tsx
- app.go
- .CreateUser
- Next.js Agent Rules
- Document Symbol
- Rosterly
- Generated Agent Rules Block
- opencode.json
- postcss.config.mjs
- Globe Icon
- Next.js Logo
- Vercel Logo
- Browser Window Icon
- github.com/Fozzyack/rosterly/m
- database.go
- user_model.go

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `next` - 9 edges
3. `NewApplication()` - 8 edges
4. `Next.js Project` - 8 edges
5. `UserHandler` - 7 edges
6. `Application` - 7 edges
7. `Graphify Knowledge Graph` - 7 edges
8. `PageAnimations()` - 6 edges
9. `SiteHeader()` - 6 edges
10. `HealthHandler` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Rosterly Docker Compose Stack` --conceptually_related_to--> `Rosterly`  [INFERRED]
  compose.yaml → README.md
- `Web Service` --conceptually_related_to--> `Next.js Project`  [INFERRED]
  compose.yaml → frontend/README.md
- `SetupRoutes()` --references--> `Application`  [EXTRACTED]
  backend/internal/routes/router.go → backend/internal/app/app.go
- `NewApplication()` --calls--> `MigrateDB()`  [EXTRACTED]
  backend/internal/app/app.go → backend/internal/database/database.go
- `NewApplication()` --calls--> `Open()`  [EXTRACTED]
  backend/internal/app/app.go → backend/internal/database/database.go

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Rosterly Service Stack** — compose_postgresql_database, compose_backend_service, compose_web_service [EXTRACTED 1.00]
- **Next.js Learning Resources** — frontend_readme_nextjs_documentation, frontend_readme_learn_nextjs, frontend_readme_nextjs_github_repository [EXTRACTED 1.00]

## Communities (25 total, 8 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (27): eslintConfig, dependencies, gsap, @gsap/react, next, react, react-dom, ignoreScripts (+19 more)

### Community 1 - "TypeScript Compiler Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "main.go"
Cohesion: 0.12
Nodes (15): GetEnv(), IsProduction(), SetupRoutes(), main(), chi.Mux, go_pkg_flag, go_pkg_fmt, go_pkg_github_com_fozzyack_rosterly_m_internal_app (+7 more)

### Community 4 - "Next.js Project"
Cohesion: 0.14
Nodes (16): Backend Service, DATABASE_URL, NEXT_PUBLIC_API_URL, PostgreSQL Database Service, Rosterly Data Volume, Web Service, create-next-app, Next.js Development Server (+8 more)

### Community 5 - "layout.tsx"
Cohesion: 0.33
Nodes (4): frontend_app_globals, geistMono, geistSans, metadata

### Community 6 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 7 - "Graphify Knowledge Graph"
Cohesion: 0.25
Nodes (8): Graphify Graph Report, graphify explain, Graphify Knowledge Graph, graphify path, graphify query, Graphify Skill, graphify update, Graphify Wiki

### Community 8 - "graphify.js"
Cohesion: 0.40
Nodes (3): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path

### Community 9 - "how-it-works/page.tsx"
Cohesion: 0.08
Nodes (21): PageAnimations(), SiteFooter(), LogoMark(), SiteHeader(), SiteHeaderProps, availability, checks, metadata (+13 more)

### Community 10 - "app.go"
Cohesion: 0.18
Nodes (17): HealthHandler, NewHealthHandler(), UserHandler, NewUserHandler(), Application, NewApplication(), UserStore, NewUserStore() (+9 more)

### Community 11 - ".CreateUser"
Cohesion: 0.21
Nodes (11): decodeJSON(), sendError(), sendJSON(), CheckPasswordHash(), HashPassword(), go_pkg_crypto_rand, go_pkg_encoding_hex, go_pkg_encoding_json (+3 more)

### Community 12 - "Next.js Agent Rules"
Cohesion: 0.50
Nodes (4): Local Next.js Documentation, Next.js Agent Rules, Version-Specific Next.js Guidance, Frontend Claude Agent Instructions

### Community 13 - "Document Symbol"
Cohesion: 0.50
Nodes (4): Document Symbol, File Icon, Folded Document Corner, Document Text Lines

### Community 14 - "Rosterly"
Cohesion: 0.67
Nodes (3): Rosterly Docker Compose Stack, Automated Roster Scheduling, Rosterly

### Community 15 - "Generated Agent Rules Block"
Cohesion: 0.67
Nodes (3): generate-agent-files.js, Generated Agent Rules Block, next dev

### Community 23 - "database.go"
Cohesion: 0.19
Nodes (12): MigrateDB(), Open(), GetDatabaseURL(), PostgresStore, NewPostgresStore(), go_pkg_database_sql, go_pkg_github_com_fozzyack_rosterly_m_internal_env, go_pkg_github_com_jackc_pgx_v5_stdlib (+4 more)

### Community 24 - "user_model.go"
Cohesion: 0.26
Nodes (8): NewUserRequest, User, PostgresStore, go_pkg_time, context.Context, time.Time, LoginRequest, UserResponse

## Knowledge Gaps
- **94 isolated node(s):** `$schema`, `plugin`, `github.com/Fozzyack/rosterly/m`, `LoginRequest`, `SiteHeaderProps` (+89 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 134 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `how-it-works/page.tsx` to `package.json`, `layout.tsx`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `Next.js Development Server` connect `Next.js Project` to `how-it-works/page.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **What connects `$schema`, `plugin`, `github.com/Fozzyack/rosterly/m` to the rest of the system?**
  _94 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `main.go` be split into smaller, more focused modules?**
  _Cohesion score 0.12280701754385964 - nodes in this community are weakly interconnected._
- **Should `Next.js Project` be split into smaller, more focused modules?**
  _Cohesion score 0.14166666666666666 - nodes in this community are weakly interconnected._
# Graph Report - rosterly  (2026-09-20)

## Corpus Check
- 50 files · ~14,732 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 6, .css 2, .example 1)

## Summary
- 310 nodes · 488 edges · 24 communities (16 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8c1e1291`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- TypeScript Compiler Configuration
- main.go
- fs.go
- Next.js Project
- dashboard.tsx
- devDependencies
- Graphify Knowledge Graph
- graphify.js
- how-it-works/page.tsx
- user_handler_test.go
- .LoginUser
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
- context.Context

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Dashboard()` - 14 edges
3. `next` - 11 edges
4. `NewApplication()` - 9 edges
5. `UserHandler` - 8 edges
6. `Application` - 8 edges
7. `Next.js Project` - 8 edges
8. `NewUserHandler()` - 7 edges
9. `User` - 7 edges
10. `shiftHours()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Rosterly Docker Compose Stack` --conceptually_related_to--> `Rosterly`  [INFERRED]
  compose.yaml → README.md
- `Web Service` --conceptually_related_to--> `Next.js Project`  [INFERRED]
  compose.yaml → frontend/README.md
- `TestLoginUserSession()` --calls--> `NewUserHandler()`  [INFERRED]
  backend/internal/api/user_handler_test.go → backend/internal/api/user_handler.go
- `loginUserStore` --embeds--> `UserStore`  [EXTRACTED]
  backend/internal/api/user_handler_test.go → backend/internal/store/user_store.go
- `loginSessionStore` --embeds--> `SessionStore`  [EXTRACTED]
  backend/internal/api/user_handler_test.go → backend/internal/store/session_store.go

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Rosterly Service Stack** — compose_postgresql_database, compose_backend_service, compose_web_service [EXTRACTED 1.00]
- **Next.js Learning Resources** — frontend_readme_nextjs_documentation, frontend_readme_learn_nextjs, frontend_readme_nextjs_github_repository [EXTRACTED 1.00]

## Communities (24 total, 8 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (29): eslintConfig, dependencies, gsap, @gsap/react, next, react, react-dom, ignoreScripts (+21 more)

### Community 1 - "TypeScript Compiler Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "main.go"
Cohesion: 0.13
Nodes (14): GetEnv(), IsProduction(), SetupRoutes(), main(), chi.Mux, go_pkg_flag, go_pkg_fmt, go_pkg_github_com_fozzyack_rosterly_m_internal_app (+6 more)

### Community 4 - "Next.js Project"
Cohesion: 0.14
Nodes (16): Backend Service, DATABASE_URL, NEXT_PUBLIC_API_URL, PostgreSQL Database Service, Rosterly Data Volume, Web Service, create-next-app, Next.js Development Server (+8 more)

### Community 5 - "dashboard.tsx"
Cohesion: 0.11
Nodes (34): Dashboard(), deleteShift(), exportRoster(), notify(), reviewRequest(), saveShift(), updateWeek(), dateLabel() (+26 more)

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
Nodes (25): PageAnimations(), SiteFooter(), LogoMark(), SiteHeader(), SiteHeaderProps, frontend_app_globals, availability, checks (+17 more)

### Community 10 - "user_handler_test.go"
Cohesion: 0.08
Nodes (40): HealthHandler, NewHealthHandler(), UserHandler, NewUserHandler(), Application, NewApplication(), MigrateDB(), Open() (+32 more)

### Community 11 - ".LoginUser"
Cohesion: 0.20
Nodes (13): TestLoginUserSession(), decodeJSON(), sendError(), sendJSON(), CheckPasswordHash(), GenerateToken(), HashPassword(), go_pkg_crypto_rand (+5 more)

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

### Community 24 - "context.Context"
Cohesion: 0.17
Nodes (13): loginSessionStore, loginUserStore, Session, NewUserRequest, User, PostgresStore, hashSessionToken(), PostgresStore (+5 more)

## Knowledge Gaps
- **98 isolated node(s):** `$schema`, `plugin`, `github.com/Fozzyack/rosterly/m`, `LoginRequest`, `SiteHeaderProps` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 143 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `how-it-works/page.tsx` to `package.json`, `dashboard.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Next.js Development Server` connect `Next.js Project` to `how-it-works/page.tsx`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `$schema`, `plugin`, `github.com/Fozzyack/rosterly/m` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `main.go` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._
- **Should `Next.js Project` be split into smaller, more focused modules?**
  _Cohesion score 0.14166666666666666 - nodes in this community are weakly interconnected._
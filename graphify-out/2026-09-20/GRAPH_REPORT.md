# Graph Report - rosterly  (2026-09-20)

## Corpus Check
- 23 files · ~5,339 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 7, .ico 1, .css 1)

## Summary
- 168 nodes · 172 edges · 23 communities (16 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c285a840`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Frontend Package Configuration
- TypeScript Compiler Configuration
- Backend Application Setup
- Backend Routing Runtime
- Next.js Project
- layout.tsx
- devDependencies
- Graphify Knowledge Graph
- graphify.js
- how-it-works/page.tsx
- dependencies
- scripts
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Next.js Project` - 8 edges
3. `next` - 7 edges
4. `Graphify Knowledge Graph` - 7 edges
5. `scripts` - 5 edges
6. `Application` - 4 edges
7. `SetupRoutes()` - 4 edges
8. `main()` - 4 edges
9. `SiteHeader()` - 4 edges
10. `PostgreSQL Database Service` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Rosterly Docker Compose Stack` --conceptually_related_to--> `Rosterly`  [INFERRED]
  compose.yaml → README.md
- `Web Service` --conceptually_related_to--> `Next.js Project`  [INFERRED]
  compose.yaml → frontend/README.md
- `SetupRoutes()` --references--> `Application`  [EXTRACTED]
  backend/internal/routes/router.go → backend/internal/app/app.go
- `main()` --calls--> `NewApplication()`  [EXTRACTED]
  backend/main.go → backend/internal/app/app.go
- `main()` --calls--> `GetEnv()`  [EXTRACTED]
  backend/main.go → backend/internal/env/env.go

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Rosterly Service Stack** — compose_postgresql_database, compose_backend_service, compose_web_service [EXTRACTED 1.00]
- **Next.js Learning Resources** — frontend_readme_nextjs_documentation, frontend_readme_learn_nextjs, frontend_readme_nextjs_github_repository [EXTRACTED 1.00]

## Communities (23 total, 7 thin omitted)

### Community 0 - "Frontend Package Configuration"
Cohesion: 0.11
Nodes (18): eslintConfig, ignoreScripts, name, packageManager, private, trustedDependencies, version, eslint (+10 more)

### Community 1 - "TypeScript Compiler Configuration"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "Backend Application Setup"
Cohesion: 0.23
Nodes (10): Application, NewApplication(), GetEnv(), IsProduction(), SetupRoutes(), main(), chi.Mux, go_pkg_github_com_rs_zerolog (+2 more)

### Community 3 - "Backend Routing Runtime"
Cohesion: 0.17
Nodes (10): go_pkg_flag, go_pkg_fmt, go_pkg_github_com_fozzyack_rosterly_m_internal_app, go_pkg_github_com_fozzyack_rosterly_m_internal_env, go_pkg_github_com_fozzyack_rosterly_m_internal_routes, go_pkg_github_com_go_chi_chi_v5, go_pkg_github_com_joho_godotenv, go_pkg_log (+2 more)

### Community 4 - "Next.js Project"
Cohesion: 0.15
Nodes (15): Backend Service, DATABASE_URL, NEXT_PUBLIC_API_URL, PostgreSQL Database Service, Rosterly Data Volume, Web Service, create-next-app, Geist (+7 more)

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
Cohesion: 0.10
Nodes (16): SiteFooter(), LogoMark(), SiteHeader(), SiteHeaderProps, availability, checks, metadata, days (+8 more)

### Community 10 - "dependencies"
Cohesion: 0.40
Nodes (5): dependencies, @gsap/react, next, react, react-dom

### Community 11 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

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

## Knowledge Gaps
- **94 isolated node(s):** `$schema`, `plugin`, `github.com/Fozzyack/rosterly/m`, `SiteHeaderProps`, `metadata` (+89 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 119 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `how-it-works/page.tsx` to `Frontend Package Configuration`, `layout.tsx`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **Why does `Next.js Project` connect `Next.js Project` to `how-it-works/page.tsx`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Next.js Development Server` connect `how-it-works/page.tsx` to `Next.js Project`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `$schema`, `plugin`, `github.com/Fozzyack/rosterly/m` to the rest of the system?**
  _94 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Package Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `how-it-works/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10317460317460317 - nodes in this community are weakly interconnected._
# Graph Report - rosterly  (2026-09-20)

## Corpus Check
- 21 files · ~3,160 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 7, .ico 1, .css 1)

## Summary
- 122 nodes · 116 edges · 18 communities (11 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `59f5d8de`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- compilerOptions
- app.go
- main.go
- layout.tsx
- devDependencies
- backend/.opencode/plugins/graphify.js
- page.tsx
- dependencies
- scripts
- frontend/README.md
- opencode.json
- AGENTS.md
- frontend/AGENTS.md
- postcss.config.mjs
- README.md
- github.com/Fozzyack/rosterly/m

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 5 edges
3. `Application` - 4 edges
4. `SetupRoutes()` - 4 edges
5. `main()` - 4 edges
6. `NewApplication()` - 3 edges
7. `GetEnv()` - 3 edges
8. `next` - 3 edges
9. `IsProduction()` - 2 edges
10. `eslint` - 2 edges

## Surprising Connections (you probably didn't know these)
- `SetupRoutes()` --references--> `Application`  [EXTRACTED]
  backend/internal/routes/router.go → backend/internal/app/app.go
- `main()` --calls--> `NewApplication()`  [EXTRACTED]
  backend/main.go → backend/internal/app/app.go
- `main()` --calls--> `GetEnv()`  [EXTRACTED]
  backend/main.go → backend/internal/env/env.go
- `main()` --calls--> `SetupRoutes()`  [EXTRACTED]
  backend/main.go → backend/internal/routes/router.go

## Import Cycles
- None detected.

## Communities (18 total, 7 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.11
Nodes (18): eslintConfig, ignoreScripts, name, packageManager, private, trustedDependencies, version, eslint (+10 more)

### Community 1 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 2 - "app.go"
Cohesion: 0.23
Nodes (10): Application, NewApplication(), GetEnv(), IsProduction(), SetupRoutes(), main(), chi.Mux, go_pkg_github_com_rs_zerolog (+2 more)

### Community 3 - "main.go"
Cohesion: 0.17
Nodes (10): go_pkg_flag, go_pkg_fmt, go_pkg_github_com_fozzyack_rosterly_m_internal_app, go_pkg_github_com_fozzyack_rosterly_m_internal_env, go_pkg_github_com_fozzyack_rosterly_m_internal_routes, go_pkg_github_com_go_chi_chi_v5, go_pkg_github_com_joho_godotenv, go_pkg_log (+2 more)

### Community 4 - "layout.tsx"
Cohesion: 0.22
Nodes (6): frontend_app_globals, geistMono, geistSans, metadata, nextConfig, next

### Community 5 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 6 - "backend/.opencode/plugins/graphify.js"
Cohesion: 0.29
Nodes (4): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path

### Community 7 - "page.tsx"
Cohesion: 0.33
Nodes (3): days, shifts, team

### Community 8 - "dependencies"
Cohesion: 0.40
Nodes (5): dependencies, @gsap/react, next, react, react-dom

### Community 9 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 10 - "frontend/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

## Knowledge Gaps
- **66 isolated node(s):** `$schema`, `plugin`, `github.com/Fozzyack/rosterly/m`, `geistSans`, `geistMono` (+61 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 91 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `next` connect `layout.tsx` to `package.json`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `$schema`, `plugin`, `github.com/Fozzyack/rosterly/m` to the rest of the system?**
  _66 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
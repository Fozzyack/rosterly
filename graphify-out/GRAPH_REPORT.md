# Graph Report - rosterly  (2026-09-26)

## Corpus Check
- 74 files · ~25,405 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 7, .css 2, .example 1)

## Summary
- 508 nodes · 1176 edges · 17 communities (11 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 49 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0f4a4260`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
- context.Context
- dashboard.tsx
- User
- seed-workspace/main.go
- package.json
- auth.ts
- README.md
- net/http.ResponseWriter
- compilerOptions
- 00003_create_roster.sql
- fs.go
- postcss.config.mjs
- github.com/Fozzyack/rosterly/m
- frontend_app_dashboard_data_role

## God Nodes (most connected - your core abstractions)
1. `Dashboard()` - 36 edges
2. `RosterHandler` - 19 edges
3. `sendError()` - 18 edges
4. `next` - 18 edges
5. `compilerOptions` - 16 edges
6. `PostgresStore` - 15 edges
7. `rosterTestStore` - 14 edges
8. `sendJSON()` - 14 edges
9. `Draft()` - 14 edges
10. `decodeRequest()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `API and current integration status` --references--> `GET()`  [INFERRED]
  README.md → frontend/app/api/roster/[...path]/route.ts
- `API and current integration status` --references--> `PUT()`  [INFERRED]
  README.md → frontend/app/api/roster/[...path]/route.ts
- `API and current integration status` --references--> `DELETE()`  [INFERRED]
  README.md → frontend/app/api/roster/[...path]/route.ts
- `Authentication and dashboard` --references--> `saveRoster()`  [INFERRED]
  frontend/README.md → frontend/lib/roster-client.ts
- `TestAuthMiddleware()` --calls--> `UserIDFromContext()`  [INFERRED]
  backend/internal/api/auth_middleware_test.go → backend/internal/api/auth_middleware.go

## Import Cycles
- None detected.

## Communities (17 total, 6 thin omitted)

### Community 0 - "next"
Cohesion: 0.06
Nodes (29): PageAnimations(), SiteFooter(), LogoMark(), SiteHeader(), SiteHeaderProps, frontend_app_globals, availability, checks (+21 more)

### Community 1 - "context.Context"
Cohesion: 0.08
Nodes (34): authSessionStore, loginSessionStore, rosterTestStore, seedRoster(), AvailabilityWindow, OpenShift, RosterResponse, SchedulingProfile (+26 more)

### Community 2 - "dashboard.tsx"
Cohesion: 0.06
Nodes (72): Dashboard(), addMember(), addTimeOff(), applyDraft(), deleteShift(), exportRoster(), generateDraft(), notify() (+64 more)

### Community 3 - "User"
Cohesion: 0.20
Nodes (8): loginUserStore, signupUserStore, TestCreateUserValidationAndDuplicateEmail(), NewUserRequest, User, PostgresStore, LoginRequest, UserResponse

### Community 4 - "seed-workspace/main.go"
Cohesion: 0.05
Nodes (81): contextKey, main(), main(), monday(), seedMembers(), seedTimeOff(), weekdayAvailability(), AuthMiddleware() (+73 more)

### Community 5 - "package.json"
Cohesion: 0.05
Nodes (38): eslintConfig, dependencies, gsap, @gsap/react, next, react, react-dom, devDependencies (+30 more)

### Community 6 - "auth.ts"
Cohesion: 0.11
Nodes (21): isSecureRequest(), POST(), isSignupRequest(), POST(), DELETE(), GET(), permitted, POST() (+13 more)

### Community 7 - "README.md"
Cohesion: 0.08
Nodes (22): Commands, Gotchas, graphify, rosterly, Structure, Workflow, This is NOT the Next.js you know, Authentication and dashboard (+14 more)

### Community 8 - "net/http.ResponseWriter"
Cohesion: 0.22
Nodes (16): UserIDFromContext(), decodeRequest(), RosterHandler, validOpenShifts(), weekStart(), decodeJSON(), sendError(), sendJSON() (+8 more)

### Community 9 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 10 - "00003_create_roster.sql"
Cohesion: 0.18
Nodes (17): users, idx_sessions_expires_at, idx_sessions_user_id, sessions, idx_roster_shifts_workspace_date, idx_team_members_workspace_id, idx_time_off_workspace_dates, roster_shifts (+9 more)

## Knowledge Gaps
- **100 isolated node(s):** `github.com/Fozzyack/rosterly/m`, `contextKey`, `TimeOffReviewRequest`, `LoginRequest`, `permitted` (+95 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 152 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `dashboard.tsx`, `package.json`, `auth.ts`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `react` connect `dashboard.tsx` to `next`, `package.json`, `auth.ts`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `API and current integration status` connect `auth.ts` to `README.md`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `github.com/Fozzyack/rosterly/m`, `contextKey`, `TimeOffReviewRequest` to the rest of the system?**
  _100 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.05807622504537205 - nodes in this community are weakly interconnected._
- **Should `context.Context` be split into smaller, more focused modules?**
  _Cohesion score 0.07738095238095238 - nodes in this community are weakly interconnected._
- **Should `dashboard.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.062434691745036575 - nodes in this community are weakly interconnected._
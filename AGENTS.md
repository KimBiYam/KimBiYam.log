# Agentic Coding Guidelines

This document outlines the development standards and operational procedures for this Next.js 16 codebase. All agents must adhere to these guidelines to ensure consistency and maintainability.

## 1. Environment & Build

### **Commands**

- **Package Manager:** `pnpm` (Core requirement. Version 11.5.1).
- **Node:** use the version in `.nvmrc` (24.22.1). The `scripts/` TypeScript files run through Node's native type stripping, so `pnpm perf`, `pnpm perf:check` and `pnpm visual:*` fail with `ERR_UNKNOWN_FILE_EXTENSION` on older Node (e.g. 22.14).
- **Install Dependencies:** `pnpm install`
- **Development Server:** `pnpm dev`
- **Production Build:** `pnpm build`
  - Note: This runs the Next.js production build and type checking.
  - Next.js 16 no longer runs linting during `next build`; run `pnpm lint` separately.
- **Linting:** `pnpm lint`
  - Runs oxlint (`.oxlintrc.json`) on `src/`, `e2e/` and `scripts/`; `pnpm lint` fails on errors.
  - The project compiler is TypeScript 7 (native). typescript-eslint does not support it, so linting is oxlint: native rules plus JS plugins (`eslint-plugin-boundaries`, `eslint-plugin-import` for `import/order`/`no-unresolved`, `eslint-plugin-react-hooks` compiler rules, aliased `react-hooks-js`). The `eslint` package stays installed only because those plugins import it; ESLint itself is not run.
  - Disable comments for the compiler rules use the alias, e.g. `// eslint-disable-next-line react-hooks-js/refs`.
  - Prettier is not enforced by lint (it never was); format with `prettier`.
  - `tsconfig.json` has no `baseUrl` (removed in TS 7); `paths` entries must start with `./`.
  - Fix all warnings before committing.
- **Analyze Bundle:** `pnpm build:analyze`

### **Testing**

- **Tools:** **Vitest** for unit tests (co-located with the code), **Playwright** for E2E (`e2e/`, desktop and mobile projects).
- **Commands:**
  - `pnpm test`: run unit tests.
  - `pnpm test:coverage`: run unit tests with coverage thresholds.
  - `pnpm test:e2e`: run E2E tests (builds and starts the app via the Playwright `webServer`). Stop any dev server on port 3000 first; locally the config reuses an existing server and would test the dev server.
- **Policy:**
  - Logic changes under `src/features/*/lib` and `src/shared/utils` need unit tests. New logic files ship with their tests.
  - User-visible behavior changes (clicks, toggles, scrolling, links, redirects, metadata endpoints) need an E2E scenario.
  - The 80% coverage floor on the logic directories is never lowered. The global floors may be lowered in the same PR only when the drop comes solely from UI/app-layer files (`shared/ui`, `widgets`, `(pages)`, `app`, `_app`) that are guarded by e2e; note it in the PR description. `pnpm test:coverage` must pass.
  - Test imports must respect the lint layer boundaries (use `@src` absolute imports).
  - E2E runs against the real contents and discovers posts at runtime (e.g. via `sitemap.xml`). Never hardcode post titles, slugs, or tags.
  - E2E waits on conditions (hydration, assertions), never `waitForTimeout`.
  - Automated runs must not report to production services. The Playwright `webServer` and the CI e2e job set `NEXT_PUBLIC_SENTRY_DISABLED=true` (read by the three Sentry `init` calls) and an empty `NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID`; `e2e/smoke.spec.ts` fails if the page sends Sentry requests. Keep these when changing the build or e2e setup.
- **Before finishing:** run `pnpm lint` plus the relevant test commands (`pnpm test` for logic changes, `pnpm test:e2e` for UI/routing changes).
- **CI:** `.github/workflows/test.yaml` runs `pnpm test:coverage` and `pnpm test:e2e` on pull requests to `main`.

## 2. Architecture & File Structure

This project follows a **Feature-Sliced Design (FSD)** inspired architecture, adapted for Next.js App Router.

### **Layer Overview**

1.  **`src/app`**: **App Router** (Routing Layer).
    - Contains `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
    - minimal logic; delegates to `(pages)` immediately.
2.  **`src/(pages)`**: **Page Layer**.
    - Composition of widgets and features for specific pages (e.g., `HomePage`, `PostPage`).
    - Can import from `widgets`, `features`, and `shared`.
    - **Note:** `src/(pages)` is used instead of `src/pages` to avoid confusion with Next.js Pages Router. Use parentheses to distinguish from standard `pages` directory.
3.  **`src/_app`**: **App Initialization**.
    - Global providers (`ThemeProvider`), root layouts, and app-wide constants.
4.  **`src/widgets`**: **Composition Layer**.
    - Complex UI blocks that combine multiple features (e.g., `PostView`, `Header`).
    - Can import from `features` and `shared`.
5.  **`src/features`**: **Business Logic Layer**.
    - User scenarios (e.g., `post`, `tag`).
    - Contains `ui`, `atoms`, `hooks`, `lib`, `types`.
    - **Rule:** Features should NOT import from other features directly (use `widgets` to compose).
6.  **`src/shared`**: **Foundation Layer**.
    - Reusable UI kit (`ui`), generic hooks (`hooks`), global state atoms (`atoms`), utils (`utils`), styles (`styles`).
    - Must NOT import from upper layers.
    - **Rule:** Shared UI must be business-agnostic (no importing app constants/types).

### **Directory Rules**

- **New Components:**
  - If generic/reusable -> `src/shared/ui`.
  - If domain-specific -> `src/features/[feature]/ui`.
  - If compositional -> `src/widgets/[widget]/ui`.
  - If page-specific composition -> `src/(pages)/[slice]/[PageName]/ui/[PageName].tsx`.
- **Imports:**
  - **ALWAYS** use absolute imports with `@src` alias.
  - ✅ `import { Button } from '@src/shared/ui';`
  - ❌ `import { Button } from '../../shared/ui';`

## 3. Code Style & Conventions

### **Syntax & Formatting**

- **Language:** TypeScript (`.ts`, `.tsx`)
- **Formatting:** Prettier is enforced (`singleQuote: true`, `semi: true`, `tabWidth: 2`).
- **Component Style:**
  - **Functional Components** with Arrow Functions.
  - ✅ `const MyComponent = () => { ... };`
  - ❌ `function MyComponent() { ... }`
  - **Export:** Default export preferred for main components (`export default PostView;`).
  - **Directives:** Use `'use client';` at the very top for client-side components.

### **Naming Conventions**

- **Files:**
  - Components: `PascalCase.tsx` (e.g., `ScrollToTopButton.tsx`).
  - Hooks/Utils/Atoms: `camelCase.ts` (e.g., `useScroll.ts`, `scrollAtom.ts`).
  - Constants: `camelCase.ts` (e.g., `metadata.ts`) or `SCREAMING_SNAKE` within files.
- **Variables/Functions:** `camelCase`.
- **Types/Interfaces:** `PascalCase` (e.g., `interface PostDetail`).
- **Props:** Explicitly typed with `interface`. Avoid `React.FC`.

### **Import Order (Enforced by lint)**

1.  **External Libraries:** React, Next.js, Jotai, Motion, etc.
2.  **Internal Absolute Imports:** `@src/app`, `@src/(pages)`, `@src/widgets`, `@src/features`, `@src/shared`, `@src/_app`.
3.  **Relative Imports:** `../`, `./` (Use sparingly, prefer absolute).
4.  **Styles:** CSS/SCSS imports (if any).

## 4. State Management (Jotai)

- **Library:** Jotai (Atomic state).
- **Pattern:**
  - Define atoms in `[layer]/atoms/atomName.ts`.
  - Use `useAtom` for read/write.
  - Use `useAtomValue` for read-only (prevents unnecessary re-renders).
  - Use `useSetAtom` for write-only.
- **Global vs Local:**
  - Shared UI state (e.g., scroll position, theme) goes in `src/shared/atoms`.
  - Feature state (e.g., current post data) goes in `src/features/[feature]/atoms`.

## 5. Styling & Animation

### **Tailwind CSS**

- **Usage:** Utility classes directly in `className`.
- **Responsive:** Use `md:`, `lg:`, `xl:` prefixes (defined in `breakPoints.json`).
- **Dark Mode:** Support `dark:` prefix (via `next-themes`).
- **Typography:** `@tailwindcss/typography` plugin is used (e.g., `prose` class for markdown).

### **Framer Motion (`motion/react`)**

- **Import:** `import { LazyMotion, domAnimation } from 'motion/react';`. Import `m` as `import * as m from 'motion/react-m';` — `import { m } from 'motion/react'` pulls in the full `motion` component and adds ~32 KB gzipped to the client bundle.
- **Performance:** Always use `LazyMotion` with `domAnimation` to reduce bundle size.
- **Global Provider:** Prefer a single global `LazyMotion` provider (in layout) over multiple nested providers.
- **Pattern:**

  ```tsx
  // In Layout
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>

  // In Components
  <m.div animate={{ opacity: 1 }} ... />
  ```

## 6. Performance & Best Practices

- **Heavy Libraries:** Avoid importing heavy libraries (e.g., `react-markdown`) in Client Components if possible. Prefer Server Components or dynamic imports.
- **Fonts:** Use `next/font` for optimal loading. Avoid external CDNs in `layout.tsx`.
- **Hooks:** Avoid routine `useMemo` / `useCallback` for render optimization. Use them only when referential stability is required by an external API, dependency array, or measurable performance issue. Rely on `reactCompiler: true` where applicable.
- **Image Optimization:** Use `next/image` with `priority` for above-the-fold content.

### **Performance loop**

Gated metric: gzip First Load JS per route (`perf-baseline.json`, measured from the built HTML; routes come from `sitemap.xml`). Build time is printed for information only. CLS is not measured (browser-dependent, too noisy to gate).

- `pnpm perf`: build (with Sentry/GA disabled, same as CI) and print metrics as JSON. Add `--reuse` to skip the build and read the existing `.next` (it must have been built with those same env vars).
- `pnpm perf:check`: compare against `perf-baseline.json`; exits non-zero when a route grows beyond tolerance (1%, min 256 B) and prints a diff table.
- `pnpm perf:update`: ratchet the baseline down (only lowered values; refuses if anything regressed; `--force` needs human approval).

Loop (max 3 attempts per run; one PR per idea):

1. `pnpm perf` -> list the top 3 bottlenecks with an estimated gzip saving each, then pick one.
2. Make one small change.
3. `pnpm perf:check` -> keep the change only if it reports `improved` (beyond tolerance). `within-tolerance` is noise, not an improvement. Otherwise discard the change and retry with the next candidate. If 3 attempts reach nothing, ship nothing and report that honestly instead of shipping noise.
4. `pnpm visual:compare` (Section 10; it diffs against a freshly fetched `origin/main` by default). A pure bundle change must show zero diff. If the change intentionally alters what users see, list only those routes in `--expect-changed`. `UNEXPECTED_CHANGE` or `REGRESSION` means fix or revert.
5. `pnpm perf:update`, and commit the lowered baseline with the change.
6. Run `pnpm lint`, `pnpm test:coverage` and `pnpm test:e2e`.
7. Push, open the PR, and publish the visual block into its description (Section 10).

Never trade away features or e2e coverage for size. If an optimization alters user-visible behavior (UI, animation, fonts, content), ask the human before proceeding.

Branch: slash-separated type prefix (`perf/...`) and a slug naming the change that ships, not a discarded attempt. Rename before pushing if needed (`git branch -m`).

PR description checklist:

- [ ] Candidates considered (top 3, estimated gzip savings) and why this one was chosen
- [ ] Before/after First Load JS per affected route (bytes and %)
- [ ] Verification: `pnpm lint`, `pnpm test:coverage`, `pnpm test:e2e`, `pnpm perf:check` status (`improved`), `pnpm visual:compare` verdict
- [ ] User-visible trade-offs a human must judge, called out explicitly (animation timing, lazy-load placeholders, replay/telemetry coverage, fonts, content)
- [ ] Discarded attempts, if any

The visual block is added by `pnpm visual:publish --pr-body` between the `<!-- visual-compare:start -->` / `<!-- visual-compare:end -->` markers. Leave the markers alone when writing the description.

Concurrent perf PRs: `perf-baseline.json` conflicts are expected when two perf PRs are open. The one that merges second rebases onto `main`, re-runs `pnpm perf` and `pnpm perf:check`, then re-runs `pnpm perf:update` instead of hand-merging the JSON. Never use `--force` for this.

## 7. Error Handling & Linting

- **Strict Mode:** TypeScript `strict: true` is enabled.
  - ❌ NO `any`.
  - ❌ NO `@ts-ignore` (unless absolutely necessary and commented).
- **Async Operations:**
  - Use `try/catch` in async functions (API calls, Server Actions).
  - handle errors gracefully in UI (Error Boundaries are configured in `src/app/error.tsx`).
- **Linter:** Run `pnpm lint` before finishing any task to catch issues early, together with the relevant test commands (see Testing in Section 1).

## 8. Agent Operational Protocol

1.  **No "Hello"**: Start working immediately.
2.  **Read First**: Always read relevant files (`read`) before editing (`edit`).
3.  **Verify**: Check `package.json` before importing new packages.
4.  **Atomic Changes**: Focus on the requested task. Do not refactor unrelated code.
5.  **Verify Before Done**: Run `pnpm lint` and the relevant tests (`pnpm test`, `pnpm test:e2e`) before reporting a task complete.
6.  **Commit Message**: Use descriptive messages if asked to commit (e.g., `feat(post): add table of contents`).

## 9. Git & PR Workflow

- Use slash-separated branch names with a clear type prefix, such as `docs/...`, `fix/...`, or `feat/...`.
- Before committing, run:
  - `git diff --check`
  - `pnpm lint`
  - the relevant test commands (`pnpm test`, `pnpm test:e2e`)
- If branch creation fails with names like `docs/...` or `fix/...`, inspect existing refs and git state before assuming the branch name itself is invalid.
- If `git push` or `gh pr create` fails because of GitHub/network resolution, report it as a remote/network failure after confirming the local commit and branch state.

## 10. Visual comparison

Numeric before/after check for UI changes (on demand; no CI gate, no checked-in images). `pnpm visual:compare [--base <ref>] [--routes /,/posts/x] [--expect-changed <routes>]` builds the base ref (temporary git worktree in the OS temp dir) and the current tree on the same machine, screenshots a route sample from `sitemap.xml` (desktop/mobile × light/dark), and reports diff pixel ratio, changed bounding box, scroll height/width delta, horizontal overflow, and CLS. Output goes to the gitignored `.visual/<timestamp>/` (`summary.json`, `comment.md`, `before/ after/ diff/`).

- `--base` defaults to `origin/main`, and for a remote-tracking ref the script runs `git fetch` itself (it errors if the fetch fails or the ref does not resolve), so a stale local `main` cannot skew the base build. Pass `--base <ref>` (local branch, tag, sha) only to compare against something else.
- After a UI change, run it with `--expect-changed` listing only the routes you meant to change.
- Any `UNEXPECTED_CHANGE` (or `REGRESSION`: new horizontal overflow or CLS increase on an expected route) exits 1: fix or revert. A route in `--expect-changed` that shows zero diff in every viewport/theme fails with `EXPECTED_CHANGE_MISSING` (exit 1): the intended change did not take effect, so fix the change; remove the route from the list only if it was listed by mistake. A listed route that changes in at least one viewport/theme counts as changed. Do not widen `--expect-changed` just to pass.
- Put the report in the PR **description**, never in a PR comment. Whenever a PR contains a UI-affecting or perf change, the agent does this itself after the PR exists, without waiting for a human request. `--pr-body` needs the PR number, so the order is:
  1. Commit, push, `gh pr create`, then read the number (from the create output or `gh pr view --json number --jq .number`). If the PR is already open, skip to step 2.
  2. `pnpm visual:compare --expect-changed <routes>`
  3. `pnpm visual:publish --pr-body <pr-number> --dry-run` (prints the body size and diff; changes nothing)
  4. `pnpm visual:publish --pr-body <pr-number>`
- After pushing further commits that change UI, re-run steps 2-4. The block is replaced idempotently.
- Prerequisites: `gh` authenticated and push access to `origin`. If a push or `gh` call is blocked or fails, report it as a remote/permission failure with the exact command instead of working around it.
- `visual:publish` pushes the referenced images to the `visual-artifacts` branch (created automatically if missing; never main or the PR branch), writes `comment.published.md` with raw GitHub URLs, and with `--pr-body` rewrites only the block between `<!-- visual-compare:start -->` and `<!-- visual-compare:end -->` in the PR description via `gh pr edit --body-file`. The author's text outside the markers is preserved byte for byte; without markers the block is appended; re-running replaces the block. With 0 changed routes (0 images) the block contains only the table and nothing is pushed. If the body would exceed GitHub's 65,536-character limit, screenshots are capped or dropped and the block says so; the author's text is never truncated.
- Without `--pr-body`, `visual:publish` only writes `comment.published.md`. Do not post it as a PR comment.
- Humans make the final call on user-visible tradeoffs.

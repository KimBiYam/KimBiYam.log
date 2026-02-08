# Agentic Coding Guidelines

This document outlines the development standards and operational procedures for this Next.js 16 codebase. All agents must adhere to these guidelines to ensure consistency and maintainability.

## 1. Environment & Build

### **Commands**

- **Package Manager:** `pnpm` (Core requirement. Version 10.x).
- **Install Dependencies:** `pnpm install`
- **Development Server:** `pnpm dev`
- **Production Build:** `pnpm build`
  - Note: This runs type checking (`tsc`) and linting as part of the Next.js build process.
- **Linting:** `pnpm lint`
  - Runs ESLint on `src/` directory.
  - Fix all warnings before committing.
- **Analyze Bundle:** `pnpm build:analyze`

### **Testing**

- **Current Status:** No testing framework (Jest/Vitest) is currently configured or enforced.
- **Policy:** Do not attempt to run tests unless you have explicitly set up a testing environment at the user's request.
- **Recommendation:** If the user asks to add tests, propose **Vitest** for unit tests and **Playwright** for E2E, as they integrate best with this modern Next.js stack.

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

### **Import Order (Enforced by ESLint)**

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

- **Import:** `import { m, LazyMotion, domAnimation } from 'motion/react';`
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
- **Hooks:** Use `useMemo` and `useCallback` appropriately, but rely on `reactCompiler: true` (Next.js 16) for automatic memoization where applicable.
- **Image Optimization:** Use `next/image` with `priority` for above-the-fold content.

## 7. Error Handling & Linting

- **Strict Mode:** TypeScript `strict: true` is enabled.
  - ❌ NO `any`.
  - ❌ NO `@ts-ignore` (unless absolutely necessary and commented).
- **Async Operations:**
  - Use `try/catch` in async functions (API calls, Server Actions).
  - handle errors gracefully in UI (Error Boundaries are configured in `src/app/error.tsx`).
- **Linter:** Run `pnpm lint` before finishing any task to catch issues early.

## 8. Agent Operational Protocol

1.  **No "Hello"**: Start working immediately.
2.  **Read First**: Always read relevant files (`read`) before editing (`edit`).
3.  **Verify**: Check `package.json` before importing new packages.
4.  **Atomic Changes**: Focus on the requested task. Do not refactor unrelated code.
5.  **Commit Message**: Use descriptive messages if asked to commit (e.g., `feat(post): add table of contents`).

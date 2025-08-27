# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KimBiYam.log is a personal developer blog built with Next.js 15, using the App Router architecture. The project follows a feature-based directory structure and uses TypeScript throughout.

## Common Development Commands

- **Development server**: `pnpm dev`
- **Build**: `pnpm build`  
- **Build with bundle analysis**: `pnpm build:analyze`
- **Production server**: `pnpm start`
- **Lint**: `pnpm lint`

**Package manager**: This project uses pnpm (v10.4.0) as specified in packageManager field.

## Architecture & Structure

### Directory Structure
- **`src/app/`** - Next.js App Router pages and API routes
- **`src/features/`** - Feature-based modules (post, tag)
- **`src/shared/`** - Shared utilities, hooks, components, and constants
- **`src/widgets/`** - Higher-level UI widgets
- **`contents/`** - Markdown blog posts organized by technology categories
- **`public/`** - Static assets including post images

### Key Patterns

**Feature-based Architecture**: Each feature (post, tag) contains:
- `atoms/` - Jotai state atoms
- `hooks/` - Feature-specific hooks
- `lib/` - Core business logic
- `ui/` - React components
- `types/` - TypeScript type definitions
- `constants/` - Feature constants

**State Management**: Uses Jotai for state management. All atoms are organized within feature directories and re-exported through index files.

**Styling**: 
- Tailwind CSS for styling with custom configuration
- Typography plugin for markdown content
- Dark mode support via `next-themes`
- Custom breakpoints defined in `src/shared/styles/breakPoints.json`

**Path Aliases**: TypeScript configured with `@src/*` alias pointing to `src/*`

### Markdown Processing
Blog posts are processed using:
- `gray-matter` for frontmatter parsing
- `remark` and `rehype` plugins for markdown processing
- `@mapbox/rehype-prism` for syntax highlighting
- Images automatically processed and optimized

### Development Tools
- **ESLint**: Custom configuration extending `eslint-config-kimbiyam-react`
- **React Compiler**: Enabled in experimental mode
- **Code Inspector**: Plugin enabled for development debugging
- **Sentry**: Integrated for error monitoring
- **Bundle Analyzer**: Available via `ANALYZE=true` environment variable

### Import Order Convention
Strict import ordering enforced by ESLint:
1. React and React-related packages
2. Next.js packages  
3. External packages
4. Internal packages (using @src alias)
5. Relative imports
6. Type imports
7. CSS imports

Always maintain alphabetical ordering within each group and use newlines between groups.
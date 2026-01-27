# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Counterspell is a text game inspired by Unseen University from Terry Pratchett's Discworld series. This is a greenfield learning project exploring Claude Code and modern web technologies.

## Technology Stack

- **Framework**: Next.js (App Router) with React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Testing**: Vitest, React Testing Library, Playwright
- **Code Quality**: ESLint with eslint-config-next, Prettier
- **Deployment**: Vercel

## Project Structure

```
app/
  layout.tsx        # Root layout
  page.tsx          # Home page
  (routes)/         # Route groups
components/         # Shared components
lib/                # Utilities and helpers
```

## Coding Standards

### Next.js App Router
- Use `app/` directory with file-based routing
- Server Components by default; use `'use client'` only when needed
- Server Actions for form handling and mutations
- Route Handlers (`route.ts`) for API endpoints
- Metadata API for SEO (`export const metadata`)

### React Patterns
- Prefer Server Components for data fetching
- Use `useActionState` and `useFormStatus` for forms
- Use `useOptimistic` for optimistic UI updates
- Minimize client-side state; use Zustand if needed

### TypeScript
- Strict mode enabled
- Use path aliases (`@/` for project root)

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

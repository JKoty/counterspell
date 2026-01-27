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

## Visual Theme

Dark fantasy graphic novel style with Discworld parody spirit.

### Color Palette
| Name           | Hex       | Usage                             |
|----------------|-----------|-----------------------------------|
| background     | `#1a1a2e` | Page background                   |
| foreground     | `#eaeaea` | Primary text                      |
| parchment      | `#d4c4a8` | Headings, important text          |
| parchment-dark | `#b8a88a` | Secondary parchment elements      |
| accent         | `#6b4c9a` | Purple accents, glows             |
| accent-light   | `#8b6cb8` | Lighter purple highlights         |
| gold           | `#c9a227` | Gold accents, icons               |
| border         | `#2d2d44` | Subtle borders, dividers          |
| panel-dark     | `#1f1f35` | Panel backgrounds (gradient end)  |
| panel-light    | `#2a2a40` | Panel backgrounds (gradient start)|
| muted-text     | `#9090a0` | Secondary text                    |
| dim-text       | `#6b6b80` | Tertiary/italic text              |

### Typography
- **Headings**: Cinzel (Google Font) - medieval fantasy serif
- **Body**: Georgia, Times New Roman - classic serif
- Use `font-[family-name:var(--font-cinzel)]` for Cinzel in Tailwind

### UI Elements
- **Panels**: Rounded corners, 2px border `#3d3d5c`, gradient background from `#2a2a40` to `#1f1f35`
- **Buttons/Counters**: Inner shadow, subtle border, gradient background
- **Accents**: Purple glow lines (`bg-gradient-to-r from-transparent via-[#6b4c9a] to-transparent`)
- **Icons**: Soft golden glow (`drop-shadow-[0_0_4px_rgba(201,162,39,0.5)]`)

### Background
Dark navy with subtle grid pattern overlay.

## Development Commands

```bash
npm run dev      # Start development server at counterspell.localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

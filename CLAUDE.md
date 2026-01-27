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

| Name           | Hex       | Usage                              |
|----------------|-----------|------------------------------------|
| background     | `#1a1a2e` | Page background                    |
| foreground     | `#eaeaea` | Primary text                       |
| parchment      | `#d4c4a8` | Headings, important text           |
| parchment-dark | `#b8a88a` | Secondary parchment elements       |
| accent         | `#6b4c9a` | Purple accents, glows              |
| accent-light   | `#8b6cb8` | Lighter purple highlights          |
| gold           | `#c9a227` | Gold accents, icons                |
| border         | `#2d2d44` | Subtle borders, dividers           |
| panel-dark     | `#1f1f35` | Panel backgrounds (gradient end)   |
| panel-light    | `#2a2a40` | Panel backgrounds (gradient start) |
| muted-text     | `#9090a0` | Secondary text                     |
| dim-text       | `#6b6b80` | Tertiary/italic text               |

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

---

## Game Design

### Core Concept

Text-based daily life simulator at a magical university. The Student (player) navigates university life through daily choices, random events, and magical duels.

### Terminology

- **Student**: The player character
- **Day**: One game turn consisting of Activity → Event → Duel
- **Activity**: What the Student chooses to do during the day
- **Event**: Random occurrence that evaluates the day's outcome
- **Duel**: End-of-day magical confrontation with another student

### Resources

| Resource | Icon    | Purpose                              |
|----------|---------|--------------------------------------|
| Fire     | Flame   | Passion, aggression, direct power    |
| Air      | Wind    | Intellect, speed, evasion            |
| Earth    | Crystal | Stability, defense, endurance        |
| Muse     | Orb     | Inspiration, creativity, wild magic  |

### Daily Gameplay Loop

```
1. MORNING: Student chooses one Activity for the day
2. DAYTIME: Event occurs based on Activity + randomness
3. EVENING: Event resolves → Resources gained/lost
4. NIGHT: Duel with rival student
5. REPEAT: Next day begins
```

### Activities (Daily Choices)

| Activity         | Risk   | Potential Rewards            |
|------------------|--------|------------------------------|
| Attend Lectures  | Low    | Air, Earth                   |
| Study in Library | Low    | Air, small Muse              |
| Explore Grounds  | Medium | Earth, Fire, random events   |
| Visit Tavern     | Medium | Fire, social events          |
| Practice Magic   | High   | Muse, Air, or disasters      |
| Scheme & Plot    | High   | Muse, Fire, or trouble       |

### Event System

Events are text-based scenarios with outcomes. Each event:
- Has narrative flavor text
- Presents 1-3 choices (or auto-resolves)
- Results in resource changes (+/-)
- May affect next day or duel

Event tone: Comedic, absurdist, Pratchett-inspired.

### Duel System

End-of-day magical duel using rock-paper-scissors core:

**Spell Types (Rock-Paper-Scissors):**

| Spell    | Beats    | Loses to |
|----------|----------|----------|
| Fireball | Illusion | Shield   |
| Shield   | Fireball | Illusion |
| Illusion | Shield   | Fireball |

**Resource Modifiers:**
- Fire: +1 to Fireball power per 10 Fire tokens
- Air: +1 to Illusion power per 10 Air tokens
- Earth: +1 to Shield power per 10 Earth tokens
- Muse: Can change spell after seeing opponent (costs 5 Muse)

**Duel Outcome:**
- Win: Gain tokens from opponent (type depends on spell used)
- Lose: Lose tokens to opponent
- Draw: Both lose small Muse (creative exhaustion)

---

## Story & Writing Guidelines

### Tone

- Satirical and absurdist (Terry Pratchett style)
- Self-aware academia parody
- Magic is powerful but hilariously unreliable
- Bureaucracy is the true enemy
- Death is an inconvenience, not an ending

### Narrative Voice

- Second person ("You enter the library...")
- Dry wit and understatement
- Footnotes for extra jokes (displayed as tooltips or asides)
- Characters speak in distinct voices

### Name Conventions

**Student Names** (player and rivals):
- Pattern: `{Adjective/Title} + {Silly Surname}`
- Examples: Ponder Stibbons Jr., Ridicully the Younger, Bengo Macarona III

**Professor Names:**
- Pattern: `{Academic Title} + {Absurd Name} + {Impossible Specialty}`
- Examples:
  - Professor Humpledink of Improbable Mathematics
  - Dean Overwelt of Unnecessary Experiments
  - Lecturer Smeems of Pointless Etymology

**Location Names:**
- Pattern: `{Grandiose Adjective} + {Mundane Noun}` or vice versa
- Examples:
  - The Grand Broom Closet
  - The Mediocre Tower of Ultimate Knowledge
  - The Department of Redundant Repetition

**Spell Names:**
- Pattern: `{Inventor's Name}'s {Adjective} {Effect}`
- Examples:
  - Winkle's Wobbling Fireball
  - Grumbolt's Slightly Reliable Shield
  - Pffft's Convincing Illusion

**Item Names:**
- Pattern: `{Material} + {Object} + "of" + {Questionable Benefit}`
- Examples:
  - Bronze Amulet of Marginal Protection
  - Dusty Tome of Mostly Accurate Spells
  - Enchanted Sock of Moderate Warmth

### Event Writing Template

```
TITLE: [Catchy, slightly absurd title]

SETUP: [1-2 sentences describing the situation]

FLAVOR: [Optional witty observation or footnote]

CHOICES (if any):
A) [Action] - [Hint at risk/reward]
B) [Action] - [Hint at risk/reward]
C) [Action] - [Hint at risk/reward]

OUTCOMES:
- Success: [Narrative + resource changes]
- Failure: [Narrative + resource changes]
- Special: [Rare outcome if applicable]
```

### Example Event

```
TITLE: The Librarian's Displeasure

SETUP: You accidentally shelve a book upside-down. The Librarian—who
is, as tradition demands, an orangutan—has noticed.

FLAVOR: Library fines at Unseen University are measured in decades.

CHOICES:
A) Apologize profusely - Safe but undignified
B) Blame a ghost - Risky but creative
C) Run - You can try

OUTCOMES:
- A Success: -1 Star (dignity), but no further consequences
- B Success: +2 Stars (audacity), Librarian amused
- B Failure: -5 Gold (fine), -2 Stars, banned for 3 days
- C: -3 Stars, -10 Gold, but you escape with a rare scroll
```

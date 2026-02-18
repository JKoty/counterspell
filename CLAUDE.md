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
- Server Components by default; use `'use client'` for interactive game UI
- Server Actions for mutations that touch persistent state (e.g. saving game progress)
- Route Handlers (`route.ts`) for API endpoints (e.g. leaderboard, save sync)
- Metadata API for SEO (`export const metadata`)

### React Patterns
- Server Components for static/initial content; `'use client'` for game UI that changes frequently
- Use Zustand for client-side game state (resources, current turn, duel state)
- Server Actions or Route Handlers for server-side persistence; avoid them for ephemeral in-session state

### TypeScript
- Strict mode enabled
- Use path aliases (`@/` for project root)

## Visual Theme

Dark fantasy graphic novel style with Discworld parody spirit. Do not use any trademarks or copyrighted material, including but not only names "Discworld" and "Unseen University".
Any "Unseen University" references should be replaced with "Invisible University".

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
- **Humours**: Consumable magical energy tokens (Fire, Air, Earth, Muse) spent during Duels
- **Clout**: Social/political assets (Prestige, Compromising Materials, Contraband, Friendship) earned and spent across all game phases

### Humours

*Consumable magical energy tokens earned through Activities and Events, spent during Duels.*

| Humour | Icon    | Purpose                              |
|--------|---------|--------------------------------------|
| Fire   | Flame   | Passion, aggression, direct power    |
| Air    | Wind    | Intellect, speed, evasion            |
| Earth  | Crystal | Stability, defense, endurance        |
| Muse   | Orb     | Inspiration, creativity, wild magic  |

Humours are **not** Duel rewards — they are spent to power spells, not won from opponents.

### Clout (Social Assets)

*Social and political assets earned through Activities, Events, and Duel wins. Can unlock special Event choices and passively influence Event outcomes.*

| Asset                  | Icon   | Earned from                                    | Spent for                                                  |
|------------------------|--------|------------------------------------------------|------------------------------------------------------------|
| Prestige               | Star   | Lectures, Duel wins, academic Events           | Authority-based Event choices, auto-passing social checks  |
| Compromising Materials | Scroll | Scheme & Plot, Illusion duel wins, Events      | Blackmail options in Events, bypassing gatekeepers         |
| Contraband             | Vial   | Explore Grounds, Fireball duel wins, Events    | Underground solutions in Events (risky if caught)          |
| Friendship             | Ribbon | Visit Tavern, Shield duel wins, Events         | Calling-in-favors options, bringing allies to Events       |

**Passive influence:** Having ≥5 of an asset can change Event outcomes without spending it (e.g., ≥5 Prestige may auto-impress a Professor).

**Spending:** Using Clout in an Event costs 1–3 of that asset (spent = lost).

### Daily Gameplay Loop

```
1. MORNING: Student chooses one Activity for the day
2. DAYTIME: Event occurs based on Activity + randomness
3. EVENING: Event resolves → Humours and Clout gained/lost
4. NIGHT: Duel with rival student
5. REPEAT: Next day begins
```

### Activities (Daily Choices)

| Activity         | Risk   | Humour Rewards         | Clout Rewards                    |
|------------------|--------|------------------------|----------------------------------|
| Attend Lectures  | Low    | Air, Earth             | +Prestige                        |
| Study in Library | Low    | Air, small Muse        | —                                |
| Explore Grounds  | Medium | Earth, Fire            | +Contraband (chance)             |
| Visit Tavern     | Medium | Fire                   | +Friendship                      |
| Practice Magic   | High   | Muse, Air, or disaster | —                                |
| Scheme & Plot    | High   | Muse, Fire, or trouble | +Compromising Materials (chance) |

### Event System

Events are text-based scenarios with outcomes. Each event:
- Has narrative flavor text
- Presents 1-3 choices (or auto-resolves)
- Results in Humour and/or Clout changes (+/-)
- May affect next day or duel
- Clout (Assets) can unlock additional choices or auto-resolve checks when held in sufficient quantity (≥5)
- Spending Clout costs 1–3 of that asset; passive Clout thresholds do not consume the asset

Event tone: Comedic, absurdist, Pratchett-inspired.

### Duel System

End-of-day magical duel using rock-paper-scissors core:

**Spell Types (Rock-Paper-Scissors):**

| Spell    | Beats    | Loses to |
|----------|----------|----------|
| Fireball | Illusion | Shield   |
| Shield   | Fireball | Illusion |
| Illusion | Shield   | Fireball |

**Humour Modifiers:**
- Fire: +1 to Fireball power per 10 Fire tokens
- Air: +1 to Illusion power per 10 Air tokens
- Earth: +1 to Shield power per 10 Earth tokens
- Muse: Can change spell after seeing opponent (costs 5 Muse)

**Duel Rewards (Clout):**
- Win: +2 Prestige always; + spell-type Asset:
  - Fireball win → +1 Contraband (looted or seized)
  - Shield win → +1 Friendship (earned respect)
  - Illusion win → +1 Compromising Materials (you know their weaknesses)
- Lose: −1 Prestige (reputation suffers)
- Draw: Both lose 1 Muse Humour (creative exhaustion); no Clout change

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
- Success: [Narrative + Humour changes + Clout changes]
- Failure: [Narrative + Humour changes + Clout changes]
- Special Clout option: [Requires X Clout, costs Y, result]
```

### Example Event

```
TITLE: The Librarian's Displeasure

SETUP: You accidentally shelve a book upside-down. The Librarian—who
is, as tradition demands, an orangutan—has noticed.

FLAVOR: Library fines at Invisible University are measured in decades.

CHOICES:
A) Apologize profusely - Safe but undignified
B) Blame a ghost - Risky but creative
C) Run - You can try
D) [Requires ≥5 Prestige] Cite academic precedent - Costs 2 Prestige

OUTCOMES:
- A Success: -1 Prestige (dignity), but no further consequences
- B Success: +2 Compromising Materials (you now know the Librarian's filing secrets), Librarian amused
- B Failure: -2 Prestige (fine and shame), banned for 3 days
- C: -1 Prestige, but you escape with a rare scroll (+3 Air)
- D: Costs 2 Prestige; Librarian is silenced; no further consequences
```

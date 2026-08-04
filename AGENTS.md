# AGENTS.md

This file provides guidance to AI coding agents working with code in this repository.

## Project Overview

Pagbutlak Website is a news publishing platform for UPV Pagbutlak, the official student and community publication of the University of the Philippines Visayas (College of Arts and Sciences).

Content sections: News, Features, Opinion, Kultura.

## Project Structure

- `src/app/(frontend)/` - Public-facing pages (articles, authors, search, sections)
  - `(sections)/` - Section listing pages (news, features, opinion, kultura)
  - `articles/` - Article listing + `[slug]` detail pages
  - `authors/` - Author listing + `[slug]` detail pages
  - `[slug]/` - Dynamic slug pages (e.g., static pages)
- `src/app/(payload)/` - Payload admin panel + API routes
- `src/blocks/` - CMS block components for rich text
- `src/collections/` - Payload collection configs
- `src/globals/` - Payload global configs
- `src/access/` - Reusable access control functions
- `src/fields/` - Shared Payload field definitions (defaultLexical, link, linkGroup)
- `src/plugins/` - Payload plugin registration
- `src/hooks/` - Payload hooks (populatePublishedAt, revalidateRedirects)
- `src/components/` - React components (including shadcn/ui in `components/ui/`)
- `src/heros/` - Hero section variants (HighImpact, MediumImpact, LowImpact)
- `src/migrations/` - Database migration files + index
- `src/constants/` - App constants (articleSections.ts)
- `src/utilities/` - Shared utilities (ui.ts for cn(), getDocument, generateMeta, etc.)
- `src/providers/` - React context providers
- `src/search/` - Search plugin customization
- `src/payload.config.ts` - Payload configuration
- `src/payload-types.ts` - Auto-generated types (DO NOT hand-edit)

## Tech Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| CMS             | Payload CMS (headless)                   |
| Framework       | Next.js (App Router)                     |
| Database        | PostgreSQL via `@payloadcms/db-postgres` |
| Language        | TypeScript (strict mode)                 |
| Styling         | Tailwind CSS + shadcn/ui                 |
| Rich Text       | Lexical (`@payloadcms/richtext-lexical`) |
| Package Manager | pnpm (DO NOT use npm or yarn)            |
| Testing         | Vitest (integration), Playwright (E2E)   |
| Deployment      | Vercel / Docker (standalone output)      |

## Quick Start

```bash
docker compose up
```

This starts two containers: `payload` (Node.js 22 Alpine) and `postgres` (PostgreSQL 16 Alpine). The app runs at `http://localhost:3000`.

For non-Docker setup, ensure `DATABASE_URI` points to a local Postgres instance (e.g., `localhost:5432`).

## Build Commands

| Command                              | Purpose                           |
| ------------------------------------ | --------------------------------- |
| `pnpm dev`                           | Start dev server                  |
| `pnpm build`                         | Production build                  |
| `pnpm lint`                          | Run ESLint                        |
| `pnpm test:int`                      | Integration tests (Vitest)        |
| `pnpm test:e2e`                      | E2E tests (Playwright)            |
| `pnpm payload migrate`               | Run pending migrations            |
| `pnpm payload migrate:create <name>` | Create a new migration            |
| `pnpm payload migrate:status`        | Check migration status            |
| `pnpm generate:types`                | Regenerate `src/payload-types.ts` |
| `pnpm generate:importmap`            | Regenerate Payload import map     |
| `pnpm seed`                          | Seed the database via CLI         |

Payload CLI commands must run **inside the Docker container** if using Docker:

```bash
docker compose exec payload pnpm payload migrate:create add_feature_x
docker compose exec payload pnpm generate:types
```

## Environment Variables

Required (see `.env.example`):

| Variable                 | Description                    |
| ------------------------ | ------------------------------ |
| `DATABASE_URI`           | PostgreSQL connection string   |
| `PAYLOAD_SECRET`         | JWT encryption secret          |
| `NEXT_PUBLIC_SERVER_URL` | Public URL (no trailing slash) |
| `CRON_SECRET`            | Cron job authentication        |
| `PREVIEW_SECRET`         | Preview request validation     |

## Coding Patterns

### Migrations - Never Manually Create Files

Always use the Payload CLI to create migrations:

```bash
pnpm payload migrate:create add_section_field
```

This generates `.ts` and `.json` files with timestamps and SQL scaffolding. The migration name should be a descriptive snake_case string (e.g., `add_section_field`, `rename_posts_to_articles`).

After creating a migration:

1. Edit the generated `up()` and `down()` functions with your SQL.
2. Register the new migration in `src/migrations/index.ts` - import it and append an entry to the `migrations` array.
3. Run `pnpm payload migrate` to apply.

**Never** edit a migration file that has already been applied to a deployed environment. Create a new migration instead.

### Types - Regenerate After Schema Changes

After modifying any Payload collection or global config, run:

```bash
pnpm generate:types
```

This regenerates `src/payload-types.ts`. Never hand-edit this file. Import types from `@/payload-types` in components and hooks.

### Import Map - Regenerate After Adding Admin Components

After adding new components used in the Payload admin panel (custom fields, custom components), run:

```bash
pnpm generate:importmap
```

### Seeding - CLI vs Admin UI

`seed()` in `src/endpoints/seed/index.ts` is the single source of truth for seed data, used by two entry points:

- Admin UI: the "Seed your database" button (`src/components/BeforeDashboard/SeedButton`) calls `POST /next/seed` (`src/app/(frontend)/next/seed/route.ts`), which requires an authenticated session.
- CLI: `pnpm seed` runs `src/scripts/seed.ts` via `payload run`, using the Local API directly (no running app server or session needed). Requires at least one existing user in the `users` collection to act as. This is the only way to seed a database that isn't reachable through a browser (e.g. prod via `DATABASE_URI`).

Seeding is destructive — it clears the seeded collections (`src/endpoints/seed/index.ts:11-20`) before repopulating them. Never run it against a database with content you want to keep.

Any new `payload.create`/`update`/`updateGlobal` call added to `seed()` must pass `context: { disableRevalidate: true }`. Without it, Next.js hooks call `revalidatePath`/`revalidateTag` outside of a request context, which throws when seeding is run standalone (CLI, or via `yarn seed`-style scripts without an active server).

If the target database has `s3Storage` enabled (S3 env vars set) but the environment running the seed script does not, uploaded media rows will be created but the actual files will be written to local disk instead of the S3 bucket — the media won't render on any environment that expects S3. Export the `S3_*` vars for that command when seeding an S3-backed database, e.g. `S3_BUCKET=... S3_ACCESS_KEY_ID=... pnpm seed` (see `useS3` in `src/plugins/index.ts`).

## Code Conventions

### Style

- **Prettier**: single quotes, no semicolons, trailing commas, 100 char print width
- **ESLint**: `next/core-web-vitals` + `next/typescript` with custom rules

### Git

- Conventional commits (enforced by commitlint): `type(scope): concise description`

### Best Practices

- **Object parameters for function arguments**
- **Prefer types over interfaces** (except when extending external types)
- **Prefer functions over classes** (classes only for errors/adapters)
- **Prefer pure functions** - when mutation is unavoidable, return the mutated object instead of void
- **Organize functions top-down** - exports before helpers
- **Use `import type` for types**, regular `import` for values, separate statements even from the same module
- **Prefix booleans** with `is`/`has`/`can`/`should` (e.g. `isValid`, `hasData`, `canEdit`) for clarity
- **Prefer self-describing names** over generic names with comments to explain their purpose

### File Organization

- Each collection/global is a folder or file in `src/collections/` or `src/globals/` exporting a config
- CMS blocks go in `src/blocks/` - each block is a folder with a component and config
- Reusable access control functions go in `src/access/`
- Shared Payload field definitions go in `src/fields/`
- Frontend pages follow Next.js App Router conventions in `src/app/(frontend)/`
- Payload admin and API routes are in `src/app/(payload)/`

### React Component File Structure

Each component should have its own named folder:

```
ComponentName/
├── index.tsx   # Component implementation
└── index.scss  # Styles (if applicable)
```

- **Do:** Create a folder per component with `index.tsx` and optional `index.scss`
- **Don't:** Place multiple `ComponentName.tsx` files in a single folder with one shared `.scss` file
- Re-export from barrel files (`index.ts`) when grouping related components in a parent directory

## Skills & Docs Reference

- **Payload CMS**: Read `.agents/skills/payload/SKILL.md` before any Payload work
- **Next.js**: Read `node_modules/next/dist/docs/` before any Next.js work

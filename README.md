<!-- PROJECT SHIELDS -->

[![Build Status][build-status-shield]][build-status-url]
[![License][license-shield]][license-url]
[![Stars][stars-shield]][stars-url]

# Pagbutlak Website

Official website of Pagbutlak UPV

## About The Project

This project is the official website for the student and community publication of CAS in UP Visayas, Pagbutlak. It publishes articles across News, Opinion, Features, and Kultura, plus a Multimedia section for video content. The CMS uses a custom role-based access control system (admin/editor/writer) to gate content creation, editing, and publishing.

## Getting Started

### Prerequisites

- Node.js (recommended to use [nvm](https://github.com/nvm-sh/nvm))

- [pnpm](https://pnpm.io/installation/)

- [PostgreSQL](https://www.postgresql.org/) (optional)

- [Docker](https://docs.docker.com/get-docker/) (optional)

### Installation

1. Clone the repository
1. `cp .env.example .env` to copy the example environment variables

#### Option 1: Local (Manual Setup)

1. Create a local PostgreSQL database.
1. `pnpm install` to install dependencies
1. `pnpm dev` start the dev server

#### Option 2: Docker

1. Start the services

   ```bash
   docker-compose up
   ```

### Usage

1. Open [http://localhost:3000](http://localhost:3000) to open the app in your browser
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin) to open the admin panel
1. Seed the database using one of the options below.

### Seeding the Database

Seeding clears existing content in the seeded collections and repopulates them with demo data. This drops data in those collections, so only run it against a database you're OK resetting.

#### Option 1: Admin UI

With the app running and an admin user logged in, click the "Seed your database" button on the admin dashboard. This calls `POST /next/seed`.

#### Option 2: CLI

Requires at least one existing user in the `users` collection (create one via the admin panel first).

```bash
pnpm seed
```

Or inside Docker:

```bash
docker compose exec payload pnpm seed
```

The CLI script (`src/scripts/seed.ts`) uses `DATABASE_URI` from your `.env`, so it can seed any environment you point it at, including a remote/prod database.

If your `.env` has S3 storage disabled (default for local dev) but the target database is meant to be served with S3 enabled (e.g. prod), uploaded seed media will go to local disk instead of the S3 bucket and won't be visible on that deployment. Export the `S3_*` vars for that one command when seeding an S3-backed environment.

## Testing

The project has three layers of tests: unit, integration, and end-to-end (E2E).

| Layer       | Tool                       | Location                     | Command         |
| ----------- | -------------------------- | ---------------------------- | --------------- |
| Unit        | Vitest                     | `src/**/*.spec.ts`           | `pnpm test:int` |
| Integration | Vitest + Payload Local API | `tests/int/**/*.int.spec.ts` | `pnpm test:int` |
| E2E         | Playwright                 | `tests/e2e/**/*.e2e.spec.ts` | `pnpm test:e2e` |

```bash
# Run everything (unit + integration, then E2E)
pnpm test

# Unit + integration only
pnpm test:int

# E2E only
pnpm test:e2e
```

Integration tests require a running Postgres database (same `DATABASE_URI` as the app). If you're using Docker, run them inside the container:

```bash
docker compose exec payload pnpm test:int
```

E2E tests require Playwright's browser binaries. If they aren't installed yet:

```bash
pnpm exec playwright install chromium
```

### Where new tests go

- **Unit:** Pure functions and logic with no DB or browser dependency (utilities, access control functions, hooks). Colocate as `*.spec.ts` next to the source file.
- **Integration:** Anything that needs a real Payload/Postgres instance (collection access control, hooks against the DB, seeding). Add to `tests/int/` as `*.int.spec.ts`.
- **E2E:** Real user flows through the browser (navigation, forms, admin flows). Add to `tests/e2e/` as `*.e2e.spec.ts`.

## Contributing

Contributions are welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## Acknowledgments

- [Payload Website Template](https://github.com/payloadcms/payload/blob/main/templates/website) for bootstrapping the project

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[build-status-shield]: https://img.shields.io/github/actions/workflow/status/pagbutlakupv/website/ci.yml?style=flat-square
[build-status-url]: https://github.com/pagbutlakupv/website/actions
[license-shield]: https://img.shields.io/github/license/pagbutlakupv/website.svg?style=flat-square&color=7E102C
[license-url]: https://github.com/pagbutlakupv/website/blob/main/LICENSE
[stars-shield]: https://img.shields.io/github/stars/pagbutlakupv/website.svg?style=flat-square&color=7E102C
[stars-url]: https://github.com/pagbutlakupv/website/stargazers

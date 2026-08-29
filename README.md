<!-- PROJECT SHIELDS -->

[![Build Status][build-status-shield]][build-status-url]
[![Vercel][vercel-shield]][vercel-url]
[![License][license-shield]][license-url]
[![Stars][stars-shield]][stars-url]

# Pagbutlak Website

Official website of Pagbutlak UPV

## About The Project

Official website for the student and community publication of CAS in UP Visayas, Pagbutlak. It publishes articles across News, Opinion, Features, and Kultura.

## Getting Started

### Prerequisites

- Node.js (recommended to use [nvm](https://github.com/nvm-sh/nvm))
- [pnpm](https://pnpm.io/installation/)
- [PostgreSQL](https://www.postgresql.org/) (optional, only for local manual setup)
- [Docker](https://docs.docker.com/get-docker/) (optional, only for Docker setup)

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
   docker compose up
   ```

### Usage

1. Open [http://localhost:3000](http://localhost:3000) to open the app in your browser
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin) to open the admin panel
1. Seed the database using one of the options below.

### Seeding the Database

Seeding is destructive: it clears existing content in the seeded collections and repopulates them with demo data. Only run it against a database you're OK resetting.

- **Admin UI:** with the app running and an admin user logged in, click "Seed your database" on the admin dashboard.
- **CLI:** requires at least one existing user in the `users` collection (create one via the admin panel first).
  ```bash
  pnpm seed
  # or inside Docker
  docker compose exec payload pnpm seed
  ```

The CLI uses `DATABASE_URI` from your `.env`, so it can seed any environment you point it at.
Export the `S3_*` vars too if that environment serves media from S3.

## Testing

| Layer       | Tool                       | Location                     |
| ----------- | -------------------------- | ---------------------------- |
| Unit        | Vitest                     | `src/**/*.spec.ts`           |
| Integration | Vitest + Payload Local API | `tests/int/**/*.int.spec.ts` |
| E2E         | Playwright                 | `tests/e2e/**/*.e2e.spec.ts` |

```bash
pnpm test       # everything: unit + integration, then E2E
pnpm test:int   # unit + integration only (needs a running Postgres, same DATABASE_URI as the app)
pnpm test:e2e   # E2E only (needs Playwright browsers: pnpm exec playwright install chromium)
```

Inside Docker, run integration tests with `docker compose exec payload pnpm test:int`.

Add unit tests next to the source as `*.spec.ts`, integration tests to `tests/int/`, and E2E tests to `tests/e2e/`.

## Contributing

Contributions are welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information.

## License

Distributed under the [Apache License 2.0](LICENSE).

## Acknowledgments

- [Payload Website Template](https://github.com/payloadcms/payload/blob/main/templates/website) for bootstrapping the project

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[build-status-shield]: https://img.shields.io/github/actions/workflow/status/pagbutlakupv/website/ci.yml?style=flat-square
[build-status-url]: https://github.com/pagbutlakupv/website/actions
[vercel-shield]: https://vercelbadge.vercel.app/api/pagbutlakupv/website?style=flat-square
[vercel-url]: https://vercel.com/pagbutlak-devs/website
[license-shield]: https://img.shields.io/github/license/pagbutlakupv/website.svg?style=flat-square&color=7E102C
[license-url]: https://github.com/pagbutlakupv/website/blob/main/LICENSE
[stars-shield]: https://img.shields.io/github/stars/pagbutlakupv/website.svg?style=flat-square&color=7E102C
[stars-url]: https://github.com/pagbutlakupv/website/stargazers

# Event Feedback Hub

Real-time feedback application for events, built with Next.js, GraphQL, PostgreSQL, and Docker.

## Overview

Event Feedback Hub enables event organizers to collect and view real-time feedback from attendees. Features include live updates via GraphQL subscriptions, star ratings, filtering, pagination, and dark mode support.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black) ![React](https://img.shields.io/badge/React-19-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

## Features

- **Real-time Updates** - Feedback appears instantly using GraphQL subscriptions (SSE)
- **Star Ratings** - 1-5 star rating system with visual feedback
- **Filtering & Pagination** - Filter by event and minimum rating
- **Dark Mode** - System preference detection with manual toggle
- **Dockerized Development** - One command to start the full stack

## Quick Start

```bash
# Start the application (builds and starts all containers)
npm run docker:up

# Push database schema
npm run db:push

# Seed sample data
npm run db:seed

# View logs
npm run docker:logs
```

Visit [http://localhost:3000](http://localhost:3000)

## Tech Stack

| Layer         | Technology                  | Why                                                |
| ------------- | --------------------------- | -------------------------------------------------- |
| **Framework** | Next.js 16 (App Router)     | Server components, streaming, native fetch caching |
| **UI**        | React 19 + Tailwind CSS 4   | Latest concurrent features, CSS-first styling      |
| **API**       | GraphQL Yoga                | Native Next.js support, built-in SSE subscriptions |
| **Client**    | Apollo Client 4             | Mature caching, devtools, TypeScript support       |
| **Database**  | PostgreSQL 16 + Drizzle ORM | Type-safe queries, native UUID/timestamp support   |
| **Container** | Docker Compose              | Reproducible environments, easy onboarding         |

## Project Structure

```
app/
├── api/graphql/          # GraphQL endpoint with Yoga
├── components/
│   ├── ui/               # Reusable components (Button, Input, etc.)
│   ├── feedback/         # FeedbackForm, FeedbackList, FeedbackItem
│   ├── events/           # EventSelector
│   └── filters/          # FilterBar, PaginationControls
├── providers/            # Theme context
└── layout.tsx            # Root layout with SSR theme
lib/
├── db/                   # Drizzle schema, connection, seeding
├── graphql/              # Schema, resolvers, pubsub
└── apollo/               # Client config with SSE link
```

## Scripts

| Command               | Description                                   |
| --------------------- | --------------------------------------------- |
| `npm run docker:up`   | Build and start all containers                |
| `npm run docker:down` | Stop all containers                           |
| `npm run docker:logs` | Follow container logs                         |
| `npm run docker:db`   | Start only PostgreSQL                         |
| `npm run db:push`     | Push schema to database                       |
| `npm run db:seed`     | Seed sample events                            |
| `npm run db:studio`   | Open Drizzle Studio GUI                       |
| `npm run dev`         | Start Next.js locally (requires DATABASE_URL) |

## Architecture Decisions

### Why GraphQL Yoga?

GraphQL Yoga was chosen for its native Next.js App Router support and built-in Server-Sent Events (SSE) for subscriptions.

### Why SSE over WebSockets?

Server-Sent Events provide real-time updates without the complexity of WebSocket connection management. Benefits:

- Works through HTTP proxies and load balancers
- Automatic reconnection built into browsers
- No custom server required for Next.js
- Lower overhead for one-way server-to-client updates

### Why PostgreSQL over SQLite?

While SQLite is simpler for development, PostgreSQL was chosen for:

- Native UUID generation (`defaultRandom()`)
- Proper timestamp types with timezone support
- Production-ready with connection pooling
- Consistent behavior between dev and production

### Why Drizzle ORM?

Drizzle provides type-safe database queries with minimal overhead:

- Schema defined in TypeScript with full inference
- No code generation step required
- Lightweight runtime compared to Prisma
- SQL-like query builder familiar to database users

### Why Cookie-based Theme?

The theme is stored in cookies (in addition to localStorage) to enable server-side rendering of the correct theme class. This eliminates the flash of incorrect theme on page load that occurs with client-only localStorage approaches.

### Why Docker for Development?

Docker Compose ensures all developers have identical environments:

- No "works on my machine" issues
- PostgreSQL version consistency
- Easy onboarding with a single command
- Matches production-like environment

## Possible Improvements

### Performance

- **Add database indexes** - Currently only basic indexes exist; analyze query patterns and add appropriate indexes
- **Implement query batching** - Use DataLoader for N+1 query prevention in GraphQL resolvers
- **Add Redis caching** - Cache frequently accessed data like event lists
- **Enable ISR** - Use Incremental Static Regeneration for event pages

### Features

- **Authentication** - Add user accounts with NextAuth.js or Clerk
- **Edit/Delete feedback** - Allow users to modify their submissions
- **Feedback moderation** - Admin approval workflow for public feedback
- **Analytics dashboard** - Visualize feedback trends, ratings over time
- **Export functionality** - CSV/PDF export for event organizers
- **Email notifications** - Notify organizers of new feedback

### Developer Experience

- **Add tests** - Unit tests with Vitest, E2E tests with Playwright
- **CI/CD pipeline** - GitHub Actions for lint, test, build, deploy
- **Database migrations** - Use Drizzle Kit migrations instead of `db:push`
- **API documentation** - Generate OpenAPI spec from GraphQL schema
- **Storybook** - Component documentation and visual testing

### Infrastructure

- **Production Dockerfile** - Multi-stage build for smaller images
- **Health checks** - Add `/api/health` endpoint for monitoring
- **Logging** - Structured logging with Pino or Winston
- **Error tracking** - Integrate Sentry for error monitoring
- **Rate limiting** - Protect GraphQL endpoint from abuse

### Code Quality

- **Stricter TypeScript** - Enable `noUncheckedIndexedAccess`
- **Form validation** - Use Zod schemas shared between client and server
- **Component testing** - Add React Testing Library tests
- **API integration tests** - Test GraphQL operations end-to-end

## Environment Variables

| Variable       | Description                  | Default             |
| -------------- | ---------------------------- | ------------------- |
| `DATABASE_URL` | PostgreSQL connection string | Set in `.env.local` |

Example `.env.local`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/event_feedback
```

> **Note:** When running with Docker, the app uses `postgres` as the hostname (Docker network). When running locally, use `localhost`.

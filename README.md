# Event Feedback Hub

> Real-time feedback application for events, built with Next.js, React, GraphQL, and SQLite.

## Overview

Event Feedback Hub enables event organizers to collect, view, and analyze real-time feedback from attendees. The app features live updates, star ratings, filtering, and a modern UI for both users and admins.

## Features

- Submit feedback for events with star ratings and comments
- Real-time updates using GraphQL subscriptions (SSE)
- Filter and paginate feedback
- Admin and attendee views
- Modern, responsive UI

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **GraphQL Yoga** (API with SSE subscriptions)
- **Apollo Client** (state management)
- **SQLite + Drizzle ORM** (database)
- **Tailwind CSS 4** (styling)
- **TypeScript** (strict mode)

## Key Directories

- `app/api/graphql/` – GraphQL endpoint (queries, mutations, subscriptions)
- `app/components/` – React components (feedback, events, filters, UI)
- `lib/db/` – Database schema and connection (Drizzle ORM + SQLite)
- `lib/graphql/` – GraphQL schema and resolvers
- `lib/apollo/` – Apollo Client config (with SSE support)
- `data/` – SQLite database file (gitignored)

## GraphQL API

- **Endpoint:** `/api/graphql` (includes GraphiQL playground)
- **Queries:** `events`, `event(id)`, `feedback(filter, pagination)`

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app.

Seed the database with sample events (optional):

```bash
npm run db:seed
```

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run lint` – Run ESLint
- `npm run db:seed` – Seed sample events to database

---

For architecture details and development guidance, see `CLAUDE.md`.

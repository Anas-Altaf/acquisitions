# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server with --watch (auto-restarts on changes)

# Linting & Formatting
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run format       # Format with Prettier
npm run format:check # Check formatting

# Database (Drizzle ORM with Neon PostgreSQL)
npm run db:generate  # Generate migrations from schema changes
npm run db:migrate   # Apply migrations
npm run db:studio    # Open Drizzle Studio UI
```

## Architecture

This is a Node.js/Express 5 REST API using ES modules with a layered architecture:

```
routes → controllers → services → models (Drizzle)
                    ↘ validations (Zod)
```

**Path Aliases**: The project uses subpath imports defined in package.json:
- `#config/*`, `#controllers/*`, `#middleware/*`, `#models/*`, `#routes/*`, `#services/*`, `#utils/*`, `#validations/*`

**Entry Point Flow**: `index.js` → loads dotenv → `server.js` → starts Express app from `app.js`

**Database**: Neon serverless PostgreSQL via `drizzle-orm`. Models are in `src/models/*.js` and export Drizzle table definitions. Migrations output to `drizzle/`.

**Validation Pattern**: Controllers validate requests using Zod schemas from `src/validations/`. Use `safeParse(req)` which validates `req.body`. Format errors with `formatValidationError()`.

**Authentication**: JWT tokens are signed/verified via `#utils/jwt.js` and stored in httpOnly cookies via `#utils/cookies.js`.

**Logging**: Winston logger in `#config/logger.js`. Logs to `logs/error.log` and `logs/combined.log`. Console output in non-production.

## Environment Variables

Required in `.env` (see `.env.example`):
- `DATABASE_URL` - Neon PostgreSQL connection string
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret for JWT signing (required in production)
- `JWT_EXPIRES_IN` - Token expiry (default: 1d)

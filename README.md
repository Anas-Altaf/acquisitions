# Acquisitions API

A production-ready Node.js REST API demonstrating modern backend development and DevOps practices.

## 🎯 Concepts Learned

### Backend Architecture

| Concept | Implementation |
|---------|----------------|
| **MVC Pattern** | Structured codebase with `controllers/`, `services/`, `models/`, `routes/` separation |
| **Express.js 5** | Latest Express with async error handling and modern middleware |
| **ES Modules** | Native ESM with `import/export` syntax and path aliases (`#config/*`, `#utils/*`) |

### Database & ORM

| Concept | Implementation |
|---------|----------------|
| **Drizzle ORM** | Type-safe SQL query builder with schema migrations |
| **Neon Serverless PostgreSQL** | Serverless-compatible Postgres with HTTP driver and local development support |
| **Database Migrations** | Version-controlled schema changes via `drizzle-kit` |

### Authentication & Security

| Concept | Implementation |
|---------|----------------|
| **JWT Authentication** | Token-based auth with `jsonwebtoken` for stateless sessions |
| **Password Hashing** | Secure password storage using `bcrypt` with salt rounds |
| **HTTP-Only Cookies** | Secure token storage preventing XSS attacks |
| **Helmet.js** | HTTP security headers (CSP, X-Frame-Options, etc.) |
| **CORS** | Cross-origin resource sharing configuration |
| **Arcjet Security** | Bot detection, rate limiting, and OWASP shield protection |

### Input Validation

| Concept | Implementation |
|---------|----------------|
| **Zod Schema Validation** | Runtime type checking with TypeScript-like schemas |
| **Request Validation** | Body/params validation with descriptive error messages |

### Logging & Monitoring

| Concept | Implementation |
|---------|----------------|
| **Winston Logger** | Structured JSON logging with multiple transports (file + console) |
| **Morgan HTTP Logging** | Request/response logging integrated with Winston |
| **Health Endpoints** | `/health` endpoint for container health checks |

### Containerization

| Concept | Implementation |
|---------|----------------|
| **Multi-Stage Builds** | Separate `builder`, `development`, and `production` Docker stages |
| **Non-Root User** | Security best practice with dedicated `nodejs` user |
| **Docker Compose** | Development and production environment orchestration |
| **Neon Local** | Local PostgreSQL container for development |
| **Health Checks** | Container-level health monitoring |
| **Hot Reload** | Development container with `--watch` mode |

### CI/CD with GitHub Actions

| Workflow | Purpose |
|----------|---------|
| **Lint & Format** | ESLint + Prettier code quality checks |
| **Tests** | Jest test execution with coverage reports |
| **Docker Build & Push** | Multi-platform image builds (amd64/arm64) with Docker Hub publishing |

### Testing

| Concept | Implementation |
|---------|----------------|
| **Jest** | Unit and integration testing framework |
| **Supertest** | HTTP assertion library for endpoint testing |
| **Coverage Reports** | V8 code coverage with artifact uploads |

### Code Quality

| Tool | Purpose |
|------|---------|
| **ESLint** | JavaScript linting with Prettier integration |
| **Prettier** | Consistent code formatting |

## 📁 Project Structure

```
├── src/
│   ├── config/        # Database, logger, Arcjet configuration
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Security, auth middleware
│   ├── models/        # Drizzle ORM schemas
│   ├── routes/        # Express route definitions
│   ├── services/      # Business logic
│   ├── utils/         # JWT, cookies, formatting helpers
│   └── validations/   # Zod validation schemas
├── drizzle/           # Database migrations
├── tests/             # Jest test files
├── .github/workflows/ # CI/CD pipelines
├── Dockerfile         # Multi-stage container build
└── docker-compose.*.yml
```

## 🚀 Quick Start

```bash
# Development with Docker
npm run dev:docker

# Production with Docker
npm run prod:docker

# Local development
npm run dev

# Run tests
npm test

# Database migrations
npm run db:generate
npm run db:migrate
```

## 📜 License

ISC

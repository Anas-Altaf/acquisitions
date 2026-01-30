# Docker Setup Guide for Acquisitions App

This guide explains how to run the Acquisitions application with Neon Database in both **development** and **production** environments.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Development Setup (Neon Local)](#development-setup-neon-local)
- [Production Setup (Neon Cloud)](#production-setup-neon-cloud)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Overview

The application supports two distinct environments:

- **Development**: Uses **Neon Local** via Docker to create ephemeral database branches automatically
- **Production**: Connects directly to **Neon Cloud** database

### Architecture

**Development:**
```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   App       │ ───▶  │ Neon Local   │ ───▶  │ Neon Cloud  │
│ Container   │       │   (Proxy)    │       │  Database   │
└─────────────┘       └──────────────┘       └─────────────┘
```

**Production:**
```
┌─────────────┐                              ┌─────────────┐
│   App       │ ──────────────────────────▶  │ Neon Cloud  │
│ Container   │                              │  Database   │
└─────────────┘                              └─────────────┘
```

## Prerequisites

- Docker and Docker Compose installed
- Neon account with a project created
- Neon API key ([Get one here](https://console.neon.tech/app/settings/api-keys))
- Your Neon Project ID and Branch ID

### Finding Your Neon Credentials

1. **API Key**: Go to [Neon Console → Settings → API Keys](https://console.neon.tech/app/settings/api-keys)
2. **Project ID**: Found in Project Settings → General
3. **Branch ID**: Found in your project's branches section
4. **Connection String**: Found in your project's dashboard under "Connection Details"

## Development Setup (Neon Local)

Neon Local creates ephemeral database branches that are automatically created when containers start and deleted when they stop.

### Step 1: Configure Environment

Copy and configure the development environment file:

```powershell
cp .env.example .env.development
```

Edit `.env.development` with your Neon credentials:

```env
# Neon API Credentials
NEON_API_KEY=neon_api_...
NEON_PROJECT_ID=purple-flower-12345678
PARENT_BRANCH_ID=br-proud-sun-87654321

# Database Name
DB_NAME=neondb
```

### Step 2: Start Development Environment

Run the application with Neon Local:

```powershell
docker-compose -f docker-compose.dev.yml up --build
```

Or in detached mode:

```powershell
docker-compose -f docker-compose.dev.yml up -d --build
```

### Step 3: Verify Setup

Check that both services are running:

```powershell
docker-compose -f docker-compose.dev.yml ps
```

Test the application:

```powershell
curl http://localhost:3000/health
```

### Step 4: Run Database Migrations (Development)

Execute migrations inside the container:

```powershell
docker exec -it acquisitions-app npm run db:migrate
```

### Step 5: Stop Development Environment

When you stop the containers, the ephemeral branch is automatically deleted:

```powershell
docker-compose -f docker-compose.dev.yml down
```

### Development Features

- **Ephemeral Branches**: Fresh database copy on each startup
- **No Manual Cleanup**: Branches deleted automatically on shutdown
- **Hot Reload**: Source code mounted for live updates
- **Debug Logging**: Verbose logging enabled

## Production Setup (Neon Cloud)

Production connects directly to your Neon Cloud database without a proxy.

### Step 1: Configure Environment

Create and configure the production environment file:

```powershell
cp .env.example .env.production
```

Edit `.env.production` with your production Neon connection string:

```env
# Production Database URL (from Neon Console)
DATABASE_URL=postgres://user:password@ep-cool-grass-123456.us-east-2.aws.neon.tech/neondb?sslmode=require

# Server Configuration
NODE_ENV=production
LOG_LEVEL=info
```

**⚠️ IMPORTANT**: Never commit `.env.production` to version control!

### Step 2: Build Production Image

Build the optimized production image:

```powershell
docker-compose -f docker-compose.prod.yml build
```

### Step 3: Run Database Migrations (Production)

Run migrations before starting the app:

```powershell
# Create a temporary container to run migrations
docker-compose -f docker-compose.prod.yml run --rm app npm run db:migrate
```

### Step 4: Start Production Environment

```powershell
docker-compose -f docker-compose.prod.yml up -d
```

### Step 5: Verify Production Deployment

Check container status:

```powershell
docker-compose -f docker-compose.prod.yml ps
```

Check application logs:

```powershell
docker-compose -f docker-compose.prod.yml logs -f app
```

Test the application:

```powershell
curl http://localhost:3000/health
```

### Step 6: Stop Production Environment

```powershell
docker-compose -f docker-compose.prod.yml down
```

## Environment Variables

### Development Environment (.env.development)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEON_API_KEY` | Your Neon API key | ✅ | `neon_api_xxx` |
| `NEON_PROJECT_ID` | Your Neon project ID | ✅ | `purple-flower-12345678` |
| `PARENT_BRANCH_ID` | Parent branch for ephemeral branches | ✅ | `br-proud-sun-87654321` |
| `DB_NAME` | Database name | ❌ | `neondb` (default) |
| `NODE_ENV` | Environment mode | ✅ | `development` |
| `LOG_LEVEL` | Logging level | ❌ | `debug` |

### Production Environment (.env.production)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | Neon Cloud connection string | ✅ | `postgres://...neon.tech/...` |
| `NODE_ENV` | Environment mode | ✅ | `production` |
| `LOG_LEVEL` | Logging level | ❌ | `info` |
| `PORT` | Application port | ❌ | `3000` (default) |

## Database Connection Behavior

The application automatically detects the environment and configures the database connection:

### Development Mode
- Detects `NODE_ENV=development` and `NEON_LOCAL_HOST`
- Configures Neon serverless driver for HTTP-only communication
- Points to `http://neon-local:5432/sql` endpoint
- Console output: `🔧 Using Neon Local at: http://neon-local:5432/sql`

### Production Mode
- Uses standard Neon Cloud connection
- WebSocket and SSL enabled by default
- Console output: `☁️  Using Neon Cloud`

## Useful Commands

### View Logs

Development:
```powershell
docker-compose -f docker-compose.dev.yml logs -f app
docker-compose -f docker-compose.dev.yml logs -f neon-local
```

Production:
```powershell
docker-compose -f docker-compose.prod.yml logs -f app
```

### Execute Commands in Container

```powershell
# Development
docker exec -it acquisitions-app sh

# Production
docker-compose -f docker-compose.prod.yml exec app sh
```

### Run Drizzle Studio (Database GUI)

Development:
```powershell
docker exec -it acquisitions-app npm run db:studio
```

Then open http://localhost:4983 in your browser.

### Rebuild Without Cache

```powershell
# Development
docker-compose -f docker-compose.dev.yml build --no-cache

# Production
docker-compose -f docker-compose.prod.yml build --no-cache
```

## Troubleshooting

### Issue: Neon Local fails to connect

**Symptoms**: App can't connect to database in development

**Solution**:
1. Verify Neon credentials in `.env.development`
2. Check Neon Local logs:
   ```powershell
   docker-compose -f docker-compose.dev.yml logs neon-local
   ```
3. Ensure your Neon API key has correct permissions
4. Verify the parent branch exists in your Neon project

### Issue: Connection timeout in production

**Symptoms**: App can't connect to Neon Cloud

**Solution**:
1. Verify `DATABASE_URL` is correct in `.env.production`
2. Check if your Neon project is active (not suspended)
3. Ensure SSL is enabled in the connection string: `?sslmode=require`
4. Verify network connectivity to Neon Cloud

### Issue: Port already in use

**Symptoms**: `Error: bind: address already in use`

**Solution**:
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Stop conflicting containers
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.prod.yml down
```

### Issue: Database migrations fail

**Symptoms**: Migration errors or schema not found

**Solution**:
1. Ensure database is accessible
2. Check migration files in `./drizzle` directory
3. Run migrations manually:
   ```powershell
   docker exec -it acquisitions-app npm run db:migrate
   ```
4. Verify `drizzle.config.js` has correct `DATABASE_URL`

### Issue: Self-signed certificate errors (Development)

**Symptoms**: SSL certificate errors in development

**Solution**: This is expected with Neon Local. The app is configured to handle self-signed certificates. If using `pg` client directly, ensure `ssl: { rejectUnauthorized: false }` is set.

## Best Practices

### Development
- ✅ Use ephemeral branches for isolated testing
- ✅ Let Docker manage branch lifecycle
- ✅ Keep Neon credentials in `.env.development` (not committed)
- ✅ Use `docker-compose down` to clean up resources

### Production
- ✅ Use production-grade Neon branch (not `main`)
- ✅ Inject secrets via environment variables or secret management
- ✅ Never hardcode credentials in code
- ✅ Enable SSL/TLS for database connections
- ✅ Set resource limits in `docker-compose.prod.yml`
- ✅ Monitor logs and set up health checks
- ✅ Use connection pooling for high traffic

## Deployment to Cloud Platforms

### Docker Hub / Container Registry

Build and push:
```powershell
docker build -t your-registry/acquisitions:latest .
docker push your-registry/acquisitions:latest
```

### Environment Variables for Cloud Deployment

Ensure these are set in your cloud platform:
- `DATABASE_URL`: Your Neon connection string
- `NODE_ENV`: `production`
- `PORT`: Application port (often provided by platform)

## Additional Resources

- [Neon Local Documentation](https://neon.com/docs/local/neon-local)
- [Neon Console](https://console.neon.tech)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## Support

For issues specific to:
- **Neon Database**: [Neon Support](https://neon.tech/docs/introduction)
- **Application**: Open an issue in the GitHub repository

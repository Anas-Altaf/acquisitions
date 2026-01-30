# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies (for production image)
RUN npm ci --only=production

# Development stage (used by docker-compose.dev.yml)
FROM node:20-alpine AS development

WORKDIR /app

# Install full dependencies for development (including devDependencies)
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Create non-root user and logs directory
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    mkdir -p logs && chown -R nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port used by the app
EXPOSE 3000

# Health check for development container
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start app in watch mode for hot reload
CMD ["node", "--watch", "src/index.js"]

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodejs:nodejs . .

# Create logs directory
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "src/index.js"]

# ── Stage 1: Base ────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# ── Stage 2: Production ───────────────────────────────────────
FROM node:24-alpine AS production
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies from base
COPY --from=base /app/node_modules ./node_modules

# Copy source code
COPY . .

# Ownership set karo
RUN chown -R appuser:appgroup /app

USER appuser

# Port expose karo
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/health || exit 1

# Start karo
CMD ["node", "server.js"]
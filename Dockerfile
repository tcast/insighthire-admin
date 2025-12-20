FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json ./
RUN npm install

# Build stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma (use local version from node_modules)
RUN ./node_modules/.bin/prisma generate

# Set production env
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Build args for NEXT_PUBLIC_ variables (needed at build time)
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_WORKOS_CLIENT_ID
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_WORKOS_CLIENT_ID=${NEXT_PUBLIC_WORKOS_CLIENT_ID}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Build Next.js with environment variables
RUN npm run build

# Production runner
FROM base AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy config files (needed for Next.js)
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json ./

# Copy built app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3010
ENV PORT 3010
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]

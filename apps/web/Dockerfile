# ARG NODE_VERSION=20.13.1

FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.1.0 --activate
RUN npm i -g turbo

# -------------------------- stage builder ---------------------------------
# Add c library and update version
FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

# Set working directory /app
WORKDIR /app
COPY . .
RUN turbo prune @acme/web --docker

# -------------------------- stage installer ---------------------------------
# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm install
RUN --mount=type=secret,id=NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_BASE_URL="$(cat /run/secrets/NEXT_PUBLIC_BASE_URL)" \
    SKIP_ENV_VALIDATION=1 pnpm build --filter=@acme/web...

# -------------------------- stage runner ---------------------------------
FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=installer /app/apps/web/next.config.js .
COPY --from=installer /app/apps/web/package.json .

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

CMD node apps/web/server.js
# apps/web/Dockerfile
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Copy lockfile and workspace settings
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY scripts/ ./scripts/

# Copy package configurations
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy app code
COPY apps/web/ ./apps/web/
COPY packages/ ./packages/

# Compile Next.js web application
RUN pnpm --filter @motohub/web build

FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

CMD ["pnpm", "--filter", "@motohub/web", "start"]

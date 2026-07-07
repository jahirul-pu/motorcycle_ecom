# apps/api/Dockerfile
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Copy lockfile and workspace settings
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY scripts/ ./scripts/

# Copy package configurations
COPY apps/api/package.json ./apps/api/
COPY packages/ui/package.json ./packages/ui/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/
COPY packages/eslint-config/package.json ./packages/eslint-config/

# Install workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy app code
COPY apps/api/ ./apps/api/
COPY packages/ ./packages/

# Generate database client mapping and compile NestJS app
RUN pnpm --filter @motohub/api exec prisma generate
RUN pnpm --filter @motohub/api build

FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3001

CMD ["pnpm", "--filter", "@motohub/api", "start"]

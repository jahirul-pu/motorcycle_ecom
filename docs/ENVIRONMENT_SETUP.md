# ENVIRONMENT_SETUP.md

# MotoHub Environment Setup

Version: 1.0

---

# Purpose

This document explains how to set up the MotoHub development environment.

---

# Minimum Requirements

Operating System

- Windows 11
- macOS
- Ubuntu 22.04+

RAM

- Minimum: 16 GB
- Recommended: 32 GB

CPU

- 4 Cores Minimum
- 8+ Cores Recommended

Storage

- SSD
- 30 GB Free Space

---

# Required Software

- Git
- Node.js 22 LTS
- pnpm
- Docker Desktop
- PostgreSQL 16+
- Redis 7+
- VS Code
- Prisma CLI

---

# Recommended VS Code Extensions

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- Error Lens
- GitLens
- Docker
- EditorConfig

---

# Clone Repository

```bash
git clone <repository-url>

cd motohub
```

---

# Install Dependencies

```bash
pnpm install
```

---

# Environment Variables

Copy

```bash
.env.example
```

to

```bash
.env
```

---

# Required Environment Variables

```env
NODE_ENV=development

PORT=3001

NEXT_PUBLIC_SITE_URL=http://localhost:3000

NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

DATABASE_URL=

REDIS_URL=

JWT_SECRET=

JWT_REFRESH_SECRET=

RESEND_API_KEY=

SSLCOMMERZ_STORE_ID=

SSLCOMMERZ_STORE_PASSWORD=

BKASH_APP_KEY=

BKASH_APP_SECRET=

S3_ENDPOINT=

S3_BUCKET=

S3_ACCESS_KEY=

S3_SECRET_KEY=
```

Never commit `.env`.

---

# Start Infrastructure

```bash
docker compose up -d
```

Services

- PostgreSQL
- Redis

---

# Database

Create database

```bash
motohub
```

---

# Prisma

Generate client

```bash
pnpm prisma generate
```

Run migrations

```bash
pnpm prisma migrate dev
```

Seed database

```bash
pnpm prisma db seed
```

Open Prisma Studio

```bash
pnpm prisma studio
```

---

# Run Backend

```bash
cd apps/api

pnpm dev
```

Backend

```
http://localhost:3001
```

Swagger

```
http://localhost:3001/api/docs
```

---

# Run Frontend

```bash
cd apps/web

pnpm dev
```

Frontend

```
http://localhost:3000
```

---

# Running Everything

Recommended

Terminal 1

```bash
docker compose up -d
```

Terminal 2

```bash
pnpm --filter api dev
```

Terminal 3

```bash
pnpm --filter web dev
```

---

# Build Commands

Frontend

```bash
pnpm --filter web build
```

Backend

```bash
pnpm --filter api build
```

---

# Lint

```bash
pnpm lint
```

---

# Format

```bash
pnpm format
```

---

# Tests

Unit

```bash
pnpm test
```

Coverage

```bash
pnpm test:coverage
```

E2E

```bash
pnpm test:e2e
```

---

# Reset Database

```bash
pnpm prisma migrate reset
```

---

# Update Prisma Client

```bash
pnpm prisma generate
```

Run after every schema change.

---

# Clear Cache

```bash
pnpm clean
```

---

# Docker Commands

Start

```bash
docker compose up -d
```

Stop

```bash
docker compose down
```

Restart

```bash
docker compose restart
```

View Logs

```bash
docker compose logs
```

---

# Git Workflow

Create branch

```bash
git checkout -b feature/product-page
```

Commit

```bash
git commit -m "feat: add product gallery"
```

Push

```bash
git push origin feature/product-page
```

---

# Before Every Commit

Run

```bash
pnpm lint

pnpm test

pnpm build
```

Do not commit if any command fails.

---

# Troubleshooting

## Port Already In Use

Stop the conflicting process or change the port in `.env`.

---

## Prisma Client Outdated

Run

```bash
pnpm prisma generate
```

---

## Migration Failed

Reset local database

```bash
pnpm prisma migrate reset
```

Development only.

---

## Docker Issues

Restart Docker Desktop

Then

```bash
docker compose down

docker compose up -d
```

---

## Missing Dependencies

Run

```bash
pnpm install
```

---

# Development Checklist

- Git installed
- Node.js installed
- pnpm installed
- Docker running
- PostgreSQL running
- Redis running
- Environment variables configured
- Dependencies installed
- Prisma migrated
- Backend running
- Frontend running

---

# Definition of Ready

Development environment is ready when

- Frontend opens successfully
- Backend starts without errors
- Database connects
- Redis connects
- Prisma works
- Swagger is accessible
- Tests execute successfully
- Lint passes

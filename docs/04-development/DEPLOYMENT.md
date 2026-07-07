# DEPLOYMENT.md

# MotoHub Deployment Guide

Version: 1.0

---

# Purpose

This document defines the deployment process for MotoHub.

Version 1 targets a single production VPS using Docker and Coolify.

---

# Production Stack

Application

- Next.js
- NestJS

Database

- PostgreSQL

Cache

- Redis

Storage

- S3 Compatible Object Storage

Reverse Proxy

- Nginx (Managed by Coolify)

SSL

- Let's Encrypt

---

# Infrastructure

```
Internet

↓

Cloudflare (Optional)

↓

Nginx

↓

Next.js

↓

NestJS API

↓

PostgreSQL

↓

Redis

↓

Object Storage
```

---

# Minimum Server

CPU

- 4 vCPU

RAM

- 8 GB

Storage

- 100 GB SSD

Bandwidth

- 1 Gbps

Operating System

- Ubuntu 24.04 LTS

---

# Recommended Server

CPU

- 8 vCPU

RAM

- 16 GB

Storage

- 250 GB NVMe SSD

---

# Domains

Production

```
motohub.com
```

API

```
api.motohub.com
```

Admin

```
motohub.com/admin
```

---

# Required Services

- Docker
- Coolify
- PostgreSQL
- Redis

---

# Environment Variables

Required

```
NODE_ENV=production

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

---

# Deployment Process

1. Pull latest code

2. Install dependencies

3. Build applications

4. Run database migrations

5. Restart services

6. Verify health

---

# Build Commands

Install

```bash
pnpm install
```

Frontend

```bash
pnpm --filter web build
```

Backend

```bash
pnpm --filter api build
```

---

# Database Migration

Before every deployment

```bash
pnpm prisma migrate deploy
```

Never use

```bash
prisma migrate dev
```

in production.

---

# Seed Data

Run only when required.

```bash
pnpm prisma db seed
```

---

# Docker

Required Containers

- Web
- API
- PostgreSQL
- Redis

---

# Health Checks

Frontend

```
/
```

Backend

```
/health
```

Database

Connection successful

Redis

Connection successful

---

# SSL

Enable HTTPS.

Redirect all HTTP traffic to HTTPS.

---

# File Storage

Product images

- Object Storage

Backups

- Separate storage location

Never store uploads inside containers.

---

# Logging

Log

- API
- Application
- Nginx
- Database

Rotate logs automatically.

---

# Monitoring

Monitor

- CPU
- Memory
- Disk
- Network
- API Health
- Database Health
- Redis Health

---

# Backups

Database

Daily

Retention

30 Days

Uploaded Files

Daily

Configuration

Weekly

Verify backup restoration monthly.

---

# Rollback

Rollback if

- Deployment fails
- Database migration fails
- Critical bug discovered

Procedure

1. Restore previous release

2. Restore database if necessary

3. Verify application

---

# Security

Production Checklist

- HTTPS enabled
- Environment variables configured
- Debug mode disabled
- Strong secrets
- Firewall enabled
- SSH keys only
- Automatic security updates

---

# CDN

Optional

Use Cloudflare for

- Images
- Static Assets
- DNS
- DDoS Protection

---

# Performance

Enable

- Gzip/Brotli
- Image Optimization
- Redis Cache
- HTTP/2
- HTTP/3 (if supported)

---

# Deployment Checklist

Before Deployment

- Code Reviewed
- Tests Passing
- Lint Passing
- Build Passing
- Documentation Updated

After Deployment

- Health Checks Pass
- Homepage Loads
- Login Works
- Product Pages Load
- Checkout Works
- Admin Accessible
- Logs Clean

---

# Disaster Recovery

Maintain

- Database Backups
- Environment Variable Backup
- Deployment Configuration Backup
- Object Storage Backup

Recovery should be possible within one hour.

---

# Definition of Successful Deployment

Deployment is complete when

- Application is accessible
- HTTPS is active
- Database connected
- Redis connected
- Object storage connected
- Health checks pass
- No critical errors in logs
- Core user flows verified
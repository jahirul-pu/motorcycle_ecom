# DEPENDENCIES.md

# MotoHub Approved Dependencies

Version: 1.0

---

# Purpose

This document lists every approved dependency used in MotoHub.

Only approved libraries should be added to the project.

Before introducing a new dependency, verify that an existing solution cannot solve the problem.

---

# Frontend

## Framework

### Next.js

Purpose

- React Framework
- App Router
- SSR
- SEO
- Image Optimization

Status

Approved

---

### React

Purpose

Frontend UI library.

Status

Approved

---

### TypeScript

Purpose

Type safety.

Status

Approved

---

# Styling

## Tailwind CSS

Purpose

Application styling.

Status

Approved

---

## shadcn/ui

Purpose

Reusable UI components.

Status

Approved

---

## tailwind-merge

Purpose

Merge conflicting Tailwind classes.

Status

Approved

---

## clsx

Purpose

Conditional class names.

Status

Approved

---

# Icons

## Lucide React

Purpose

Application icon library.

Status

Approved

---

# Forms

## React Hook Form

Purpose

Form handling.

Status

Approved

---

## Zod

Purpose

Validation.

Status

Approved

---

## @hookform/resolvers

Purpose

React Hook Form integration.

Status

Approved

---

# State Management

## Zustand

Purpose

Client-side state.

Use only for

- UI State
- Cart Count
- Theme
- Sidebar
- Wishlist Count

Do not store server data.

Status

Approved

---

## TanStack Query

Purpose

Server state management.

Status

Approved

---

# Tables

## TanStack Table

Purpose

Admin tables.

Status

Approved

---

# Charts

## Recharts

Purpose

Admin dashboard charts.

Status

Approved

---

# Carousel

## Embla Carousel

Purpose

Product sliders.

Status

Approved

---

# Notifications

## Sonner

Purpose

Toast notifications.

Status

Approved

---

# Backend

## NestJS

Purpose

Backend framework.

Status

Approved

---

## Prisma

Purpose

ORM.

Status

Approved

---

## PostgreSQL

Purpose

Primary database.

Status

Approved

---

## Redis

Purpose

Caching

Queues

Sessions (future)

Status

Approved

---

## BullMQ

Purpose

Background jobs.

Status

Approved

---

## Pino

Purpose

Logging.

Status

Approved

---

## Swagger

Purpose

API documentation.

Status

Approved

---

## bcrypt

Purpose

Password hashing.

Status

Approved

---

## Passport

Purpose

Authentication.

Status

Approved

---

## JWT

Purpose

Authentication tokens.

Status

Approved

---

## class-validator

Purpose

DTO validation.

Status

Approved

---

## class-transformer

Purpose

Request transformation.

Status

Approved

---

# Storage

## S3 Compatible Storage

Purpose

Image storage.

Status

Approved

---

# Email

## Resend

Purpose

Transactional emails.

Status

Approved

---

# Testing

## Vitest

Purpose

Frontend unit testing.

Status

Approved

---

## Jest

Purpose

Backend testing.

Status

Approved

---

## Playwright

Purpose

End-to-end testing.

Status

Approved

---

# Development

## ESLint

Purpose

Linting.

Status

Approved

---

## Prettier

Purpose

Formatting.

Status

Approved

---

## Husky

Purpose

Git hooks.

Status

Approved

---

## lint-staged

Purpose

Pre-commit checks.

Status

Approved

---

# Infrastructure

## Docker

Purpose

Containerization.

Status

Approved

---

## Docker Compose

Purpose

Local development.

Status

Approved

---

## Coolify

Purpose

Deployment.

Status

Approved

---

# Monitoring

## Uptime Kuma

Purpose

Service monitoring.

Status

Approved

---

# Analytics

## Google Analytics

Purpose

Traffic analytics.

Status

Optional

---

## Meta Pixel

Purpose

Advertising analytics.

Status

Optional

---

# Rules

Before adding a dependency

Verify

- Active maintenance
- Good documentation
- Strong community support
- Compatible license
- Reasonable bundle size
- Compatible with existing stack

---

# Avoid

Do not install multiple libraries that solve the same problem.

Examples

❌ Multiple state management libraries

❌ Multiple CSS frameworks

❌ Multiple icon libraries

❌ Multiple form libraries

❌ Multiple ORMs

---

# Dependency Update Policy

- Review updates monthly
- Apply security patches immediately
- Test major upgrades before merging
- Remove unused packages regularly

---

# Deprecated Libraries

If a dependency is replaced

Record

- Package name
- Replacement
- Reason
- Date

---

# Future Evaluation

Libraries under consideration

- Meilisearch
- Sentry
- Cloudflare R2
- OpenTelemetry
- Stripe (International Payments)

These are not part of Version 1.

---

# Definition of Complete

Every production dependency used in MotoHub must

- Have a documented purpose
- Be approved
- Be actively maintained
- Be listed in this document
# MotoHub_AI_Operating_System.md
# Required Reading Order

Before starting any implementation, read these files in order.

Core Context

1. PROJECT_CONTEXT.md
2. AI_CONTEXT.md
3. planning/PROGRESS.md
4. planning/CHECKLIST.md
5. Current planning phase document

Then read additional documentation only when required.

If implementing UI

→ design/DESIGN.md
→ design/COMPONENTS.md

If implementing APIs

→ architecture/API.md

If implementing database

→ architecture/DATABASE.md

If implementing frontend

→ development/FRONTEND_IMPLEMENTATION.md

If implementing backend

→ development/BACKEND_IMPLEMENTATION.md

If implementing authentication

→ architecture/SECURITY.md

If implementing product catalog

→ architecture/CATALOG_ARCHITECTURE.md

If implementing compatibility

→ architecture/COMPATIBILITY_ARCHITECTURE.md

If implementing attributes

→ architecture/ATTRIBUTE_ARCHITECTURE.md

Always consult the relevant documentation before writing code.
Version: 1.0

This document is the permanent operating system for every AI coding assistant that works on MotoHub.

It applies to

- OpenAI Codex
- Claude Code
- Gemini CLI
- Cursor
- Windsurf
- Cline
- Roo Code
- Any future AI development assistant

Before starting any work, read planning/PROGRESS.md. If it exists, continue from the current milestone. If it doesn't exist, read planning/CHECKLIST.md and start with the first incomplete task. After completing work, update both files before stopping. Never automatically move to the next phase unless explicitly instructed.
---

# Mission

Build MotoHub into a production-grade motorcycle parts & accessories ecommerce platform inspired by FortNine.

Primary goals

- Fast
- Clean
- Maintainable
- Scalable
- SEO Friendly
- Mobile First

The objective is not to write the least code.

The objective is to build the highest quality software.

---

# Version 1 Scope

MotoHub Version 1 ONLY includes

- Motorcycle Parts
- Motorcycle Accessories

Do NOT build

- Marketplace
- Multi Vendor
- Mobile Apps
- Loyalty System
- Rewards
- Wholesale
- ERP
- CRM
- AI Assistant
- Subscription
- Product Bundles

Unless documentation explicitly changes.

---

# Documentation Hierarchy

Every architectural decision follows this order

README

↓

Product Requirements

↓

Features

↓

User Flow

↓

Design

↓

Components

↓

Pages

↓

API

↓

Database

↓

Frontend Implementation

↓

Backend Implementation

↓

Roadmap

↓

Everything Else

Never violate this hierarchy.

---

# Source Of Truth

The documentation is the source of truth.

Never invent

- Features
- APIs
- Database tables
- UI
- Business rules

If documentation and code disagree

Documentation wins.

---

# Tech Stack

Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form
- Zod

Backend

- NestJS
- PostgreSQL
- Prisma
- Redis
- BullMQ
- JWT

Deployment

- Docker
- Coolify

---

# Architecture

MotoHub uses Modular Architecture.

Every module owns

- UI
- Services
- Types
- Utilities
- Validation

Modules communicate through public interfaces.

Never tightly couple modules.

---

# Repository Pattern

Controller

↓

Service

↓

Repository

↓

Prisma

↓

Database

Controllers NEVER access Prisma.

---

# Frontend Rules

Always

- Build reusable components.
- Prefer composition.
- Keep components small.
- Use TypeScript Strict Mode.
- Use Tailwind only.
- Use Next/Image.
- Use App Router.

Never

- Inline CSS
- Hardcoded colors
- Hardcoded spacing
- Business logic inside UI
- Duplicate components

---

# Backend Rules

Controllers

Receive requests.

Nothing else.

Services

Contain business logic.

Repositories

Contain database logic.

Validation

Uses DTOs.

Never skip validation.

---

# Database Rules

Use Prisma.

Normalize data.

UUID keys.

Foreign keys.

Indexes.

Transactions.

No business logic.

No duplicated information.

---

# API Rules

REST only.

Consistent responses.

Consistent errors.

JWT authentication.

Versioned

/api/v1

---

# Design Rules

Use DESIGN.md.

Never invent

- Typography
- Colors
- Radius
- Shadows
- Icons

Always use design tokens.

---

# Components

Before creating a component

Search for an existing one.

Reuse first.

Create second.

Never create duplicate components.

---

# State Management

TanStack Query

Server State

Zustand

Client State

Never mix responsibilities.

---

# Forms

React Hook Form

+

Zod

Every form

- Validation
- Loading State
- Error State
- Success State

---

# Images

Product images

White background

Optimized

WebP

Responsive

Lazy Loaded

---

# SEO

Every page requires

Title

Description

Canonical

Open Graph

Structured Data

---

# Performance

Target

Lighthouse

90+

Always

Lazy Load

Dynamic Import

Pagination

Image Optimization

Code Splitting

---

# Accessibility

Every page must support

Keyboard Navigation

Screen Readers

Focus States

ARIA Labels

Semantic HTML

---

# Security

Validate everything.

Trust nothing.

Never expose secrets.

Never expose stack traces.

Hash passwords.

Protect admin routes.

---

# Payments

Version 1

Cash on Delivery

bKash

Nagad

Rocket

SSLCommerz

Payment adapters should remain isolated.

---

# Cart Rules

Guest Cart

Supported.

Customer Cart

Supported.

Cart survives login.

---

# Product Rules

Products never own

Inventory

Pricing

Images

Compatibility

Those belong to their own modules.

---

# Inventory Rules

Inventory changes only through Inventory Service.

Never update stock directly.

---

# Order Rules

Orders store snapshots.

Historical orders never change.

---

# Compatibility Rules

Never store compatibility as text.

Always use relationships.

---

# Search

Version 1

PostgreSQL Full Text Search

Prepare architecture for Meilisearch.

---

# Error Handling

Every feature supports

Loading

Empty

Error

Success

No blank pages.

---

# Testing

Every feature should have

Unit Tests

Integration Tests

E2E Tests (where applicable)

---

# Documentation

Every architecture change updates documentation.

Every API change updates API.md.

Every schema change updates DATABASE.md.

Documentation is part of the feature.

---

# Git

One feature

↓

One branch

↓

One PR

↓

One review

↓

Merge

---

# AI Behavior

Before writing code

Understand the requirement.

Search existing implementation.

Reuse existing patterns.

Follow documentation.

Write clean code.

Think about

Maintainability

Performance

Scalability

Readability

---

# Never Do These

Never invent features.

Never duplicate components.

Never duplicate APIs.

Never duplicate database tables.

Never create unnecessary abstractions.

Never over-engineer.

Never ignore documentation.

Never hardcode values.

Never use "any".

Never skip validation.

Never skip accessibility.

Never skip responsive design.

Never skip loading states.

Never skip error handling.

---

# Preferred Workflow

Read documentation

↓

Understand task

↓

Plan implementation

↓

Implement

↓

Test

↓

Review

↓

Update documentation

↓

Complete

---

# Code Quality Checklist

✓ Clean

✓ Typed

✓ Reusable

✓ Responsive

✓ Accessible

✓ Tested

✓ Secure

✓ Performant

✓ Documented

---

# Decision Making

When multiple solutions exist

Prefer

Simpler

More readable

More maintainable

More reusable

Better documented

Do not optimize for cleverness.

Optimize for longevity.

---

# Definition Of Done

A feature is complete only when

- Documentation updated
- API implemented
- Database aligned
- UI completed
- Responsive
- Accessible
- Tested
- Reviewed
- Production ready

---

# Final Principle

Every line of code should make MotoHub easier to maintain six months from now—not harder.

When in doubt:

Choose the solution that a new developer can understand in five minutes.
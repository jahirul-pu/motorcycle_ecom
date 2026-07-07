# MotoHub Project Structure

Version: 1.0

---

# Purpose

This document defines the standard folder structure for MotoHub.

Every developer and AI coding assistant must follow this structure.

No feature should create its own custom organization.

---

# Architecture

MotoHub follows a modular architecture.

- Frontend
- Backend
- Documentation
- Infrastructure

Each layer is independent.

---

# Repository Structure

```
motohub/

├── apps/
├── packages/
├── docs/
├── infrastructure/
├── scripts/
├── .github/
├── docker/
├── .env.example
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

# apps/

Contains runnable applications.

```
apps/

├── web/
├── api/
└── admin/
```

---

## web/

Customer-facing Next.js application.

```
web/

src/

public/

tests/

package.json

next.config.ts

tailwind.config.ts

tsconfig.json
```

---

## api/

NestJS backend.

```
api/

src/

prisma/

test/

package.json

nest-cli.json

tsconfig.json
```

---

## admin/

Reserved for a future standalone admin application.

Version 1 will use

```
/admin
```

inside the Next.js application.

---

# packages/

Shared code.

```
packages/

├── ui/
├── types/
├── config/
├── utils/
└── eslint-config/
```

---

## ui/

Reusable UI components.

Examples

```
Button

Card

Input

Modal

Toast
```

---

## types/

Shared TypeScript types.

Examples

```
Product

Category

Brand

Order

User
```

---

## config/

Shared configuration.

Examples

```
API URLs

Theme

Constants

Permissions

Routes
```

---

## utils/

Reusable helper functions.

Examples

```
Currency Formatting

Date Formatting

Validation

Slug Generation
```

---

# docs/

Project documentation.

```
docs/

README.md

product/

design/

architecture/

development/

reference/

prompts/
```

Documentation is version-controlled.

Documentation is part of the product.

---

# infrastructure/

Infrastructure configuration.

```
infrastructure/

docker/

nginx/

postgres/

redis/

coolify/
```

---

# scripts/

Automation scripts.

Examples

```
Seed Database

Backup Database

Generate Types

Optimize Images

Cleanup Files
```

---

# .github/

GitHub configuration.

```
.github/

workflows/

ISSUE_TEMPLATE/

PULL_REQUEST_TEMPLATE/

CODEOWNERS
```

---

# Frontend Structure

```
src/

app/

components/

features/

hooks/

services/

store/

providers/

constants/

utils/

types/

styles/

assets/

middleware.ts
```

---

# app/

App Router only.

```
app/

(auth)

(shop)

(account)

(admin)

api/

layout.tsx

page.tsx

loading.tsx

error.tsx

not-found.tsx
```

---

# features/

Business modules.

```
features/

auth/

product/

category/

brand/

cart/

checkout/

wishlist/

order/

review/

customer/

search/
```

Every feature owns its own

- components
- hooks
- services
- types
- utils

---

Example

```
product/

components/

hooks/

services/

types/

utils/
```

---

# components/

Reusable UI only.

```
components/

ui/

layout/

navigation/

forms/

feedback/

shared/
```

Business logic is not allowed here.

---

# hooks/

Reusable hooks.

```
useCart

useWishlist

useDebounce

usePagination

useMediaQuery
```

---

# services/

API layer.

```
auth.service.ts

product.service.ts

category.service.ts

cart.service.ts

order.service.ts
```

Never call fetch() directly from components.

---

# store/

Global state.

```
cart.store.ts

ui.store.ts

auth.store.ts
```

Only global UI state belongs here.

---

# Backend Structure

```
src/

modules/

common/

config/

guards/

filters/

pipes/

interceptors/

middleware/

jobs/

storage/

prisma/

main.ts
```

---

# modules/

Each module follows the same structure.

```
product/

product.module.ts

product.controller.ts

product.service.ts

product.repository.ts

product.dto.ts

product.mapper.ts

product.types.ts
```

---

# Common

Reusable backend code.

```
common/

constants/

decorators/

exceptions/

helpers/

interfaces/

utils/
```

---

# Prisma

```
prisma/

schema.prisma

migrations/

seed.ts
```

Only Prisma files belong here.

---

# Storage

```
storage/

uploads/

image-processing/

adapters/
```

---

# Testing

Frontend

```
tests/

unit/

integration/

e2e/
```

Backend

```
test/

unit/

integration/

e2e/
```

---

# Public Assets

```
public/

images/

icons/

logos/

fonts/

banners/
```

Do not store uploaded product images here.

Those belong in object storage.

---

# Environment Files

```
.env

.env.local

.env.development

.env.production

.env.example
```

Never commit secrets.

Only commit

```
.env.example
```

---

# Naming Conventions

Folders

```
lowercase
```

Files

```
kebab-case

except

React Components

PascalCase
```

Examples

```
product.service.ts

ProductCard.tsx

cart.store.ts

order.types.ts
```

---

# Import Rules

Preferred

```
@/components

@/features

@/hooks

@/utils

@/services
```

Avoid long relative imports.

Example

Instead of

```
../../../../components/Button
```

Use

```
@/components/Button
```

---

# File Size Guidelines

Component

< 250 lines

Hook

< 150 lines

Service

< 300 lines

Controller

< 150 lines

If larger,

Split the file.

---

# Dependency Rules

Components

↓

Hooks

↓

Services

↓

API

Never reverse the dependency direction.

---

# Documentation Rules

Every major module should contain

```
README.md
```

explaining

- purpose
- dependencies
- public API

---

# Definition of Complete Structure

✓ Predictable

✓ Modular

✓ Scalable

✓ Easy to navigate

✓ AI-friendly

✓ Suitable for long-term maintenance
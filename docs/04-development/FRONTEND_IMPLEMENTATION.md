# MotoHub Frontend Implementation Guide

Version: 1.0

---

# Purpose

This document defines how the frontend should be built.

It standardizes project structure, coding style, architecture, and implementation order.

---

# Tech Stack

Framework

- Next.js (App Router)

Language

- TypeScript

Styling

- Tailwind CSS

UI Components

- shadcn/ui

Icons

- Lucide React

Forms

- React Hook Form

Validation

- Zod

Data Fetching

- TanStack Query

State Management

- Zustand

Carousel

- Embla Carousel

Tables

- TanStack Table

Charts (Admin)

- Recharts

Image Optimization

- Next/Image

---

# Project Structure

```
src/

├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── store/
├── types/
├── utils/
├── constants/
├── styles/
└── providers/
```

---

# App Structure

```
app/

(auth)

(shop)

(account)

(admin)

api

layout.tsx

page.tsx

not-found.tsx
```

---

# Feature Structure

Every feature should follow the same pattern.

```
features/

product/

components/

hooks/

services/

types/

utils/
```

Avoid placing business logic inside components.

---

# Components

```
components/

ui/

layout/

navigation/

product/

cart/

checkout/

forms/

common/

feedback/
```

Rules

- Keep components small.
- One responsibility per component.
- Prefer composition over inheritance.

---

# Routing

Public

```
/

/products

/product/[slug]

/category/[slug]

/brand/[slug]

/search
```

Customer

```
/login

/register

/account

/account/orders

/account/profile

/account/addresses

/wishlist

/cart

/checkout
```

Admin

```
/admin

/admin/products

/admin/orders

/admin/categories

/admin/brands

/admin/customers

/admin/reviews

/admin/settings
```

---

# State Management

Use Zustand only for global UI state.

Examples

- Theme
- Cart Count
- Sidebar
- Search Overlay
- Wishlist Count

Do NOT use Zustand for server data.

---

# Server State

Use TanStack Query.

Examples

- Products
- Categories
- Brands
- Orders
- Reviews
- Dashboard Data

Never duplicate server state inside Zustand.

---

# API Layer

```
services/

auth.service.ts

product.service.ts

category.service.ts

brand.service.ts

cart.service.ts

order.service.ts
```

Components never call fetch() directly.

---

# Environment Variables

```
NEXT_PUBLIC_API_URL

NEXT_PUBLIC_SITE_URL

NEXT_PUBLIC_GOOGLE_ANALYTICS

NEXT_PUBLIC_FACEBOOK_PIXEL
```

---

# Authentication

JWT

↓

Refresh Token

↓

Protected Routes

↓

Role Check

Customer and Admin remain separated.

---

# Forms

All forms use

- React Hook Form
- Zod Validation

Never build forms manually.

---

# Error Handling

Every page must handle

- Loading
- Empty State
- Error State
- Success State

No blank screens.

---

# Images

Use

Next/Image

Requirements

- Lazy Loading
- Responsive Sizes
- Blur Placeholder
- WebP
- AVIF

Never use `<img>` directly.

---

# SEO

Every page defines

- Title
- Description
- Canonical URL
- Open Graph
- Structured Data (where applicable)

Use Next.js Metadata API.

---

# Performance

Enable

- Code Splitting
- Dynamic Imports
- Image Optimization
- Lazy Loading
- Route Prefetching

Target Lighthouse Score

90+

---

# Styling Rules

Only Tailwind CSS.

No inline styles.

No custom CSS unless absolutely necessary.

Use design tokens from DESIGN.md.

---

# Component Rules

Each component should include

- TypeScript Props
- Loading State
- Error State (if applicable)
- Responsive Layout
- Accessibility

---

# Naming Convention

Components

```
ProductCard.tsx
```

Hooks

```
useCart.ts
```

Services

```
product.service.ts
```

Stores

```
cart.store.ts
```

Types

```
product.types.ts
```

---

# Folder Example

```
features/product/

components/

ProductCard.tsx

ProductGallery.tsx

ProductPrice.tsx

ProductSpecifications.tsx

hooks/

useProduct.ts

services/

product.service.ts

types/

product.types.ts
```

---

# Code Standards

- TypeScript Strict Mode
- ESLint
- Prettier
- Absolute Imports
- No `any` type
- Reusable functions
- Small components

---

# Accessibility

Required

- Keyboard Navigation
- ARIA Labels
- Visible Focus
- Semantic HTML
- Proper Form Labels
- Alt Text

---

# Responsive Design

Mobile First

Breakpoints

- Mobile
- Tablet
- Laptop
- Desktop
- Wide

Every page must be tested on all breakpoints.

---

# Notifications

Use Toasts for

- Success
- Error
- Warning
- Information

Do not use browser alerts.

---

# Build Order

## Phase 1

- Project Setup
- Layout
- Navigation
- Footer
- Authentication

---

## Phase 2

- Homepage
- Categories
- Brands
- Product Listing
- Product Details

---

## Phase 3

- Search
- Wishlist
- Cart
- Checkout

---

## Phase 4

- Customer Dashboard
- Orders
- Addresses
- Profile

---

## Phase 5

- Admin Dashboard
- Product Management
- Order Management
- Categories
- Brands
- Reviews
- Coupons
- CMS
- Settings

---

## Phase 6

- Performance Optimization
- SEO
- Accessibility
- Testing
- Bug Fixes

---

# Testing

Unit Tests

- Utility Functions
- Hooks

Component Tests

- ProductCard
- Cart
- Checkout

E2E Tests

- Browse Product
- Add to Cart
- Checkout
- Login
- Admin Product Creation

---

# Definition of Done

A frontend feature is complete when:

- UI matches DESIGN.md
- Uses reusable components
- Responsive
- Accessible
- Connected to API
- Error handling implemented
- Loading state implemented
- Tested
- Reviewed

---

# Frontend Milestones

Milestone 1

Foundation

Milestone 2

Shopping Experience

Milestone 3

Customer Features

Milestone 4

Admin Panel

Milestone 5

Optimization & Release

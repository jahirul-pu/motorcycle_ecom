# DECISIONS.md

# MotoHub Architecture Decision Log

Version: 1.0

---

# Purpose

This document records important architectural decisions made during the development of MotoHub.

Every significant technical decision should be documented here.

---

# Status

Possible statuses

- Proposed
- Accepted
- Deprecated
- Rejected
- Replaced

---

# ADR-001

Title

Separate Pricing from Products

Status

Accepted

Decision

Products do not store pricing.

Pricing is managed through a dedicated Pricing module.

Reason

- Easier future pricing strategies
- Scheduled sales
- Cleaner product model
- Better maintainability

---

# ADR-002

Title

Separate Inventory Module

Status

Accepted

Decision

Inventory is independent from Products.

Reason

- Better stock management
- Transaction history
- Multiple warehouses support
- Cleaner architecture

---

# ADR-003

Title

Media Library

Status

Accepted

Decision

All uploaded assets are managed by a centralized Media module.

Reason

- Prevent duplicated files
- Easier optimization
- Future CDN support
- Shared media management

---

# ADR-004

Title

UUID Primary Keys

Status

Accepted

Decision

All business entities use UUID primary keys.

Reason

- More secure
- Better scalability
- Safer public URLs
- Easier data imports

---

# ADR-005

Title

PostgreSQL

Status

Accepted

Decision

PostgreSQL is the primary database.

Reason

- Reliability
- Performance
- Prisma support
- Full-text search
- JSON support

---

# ADR-006

Title

Prisma ORM

Status

Accepted

Decision

Use Prisma as the ORM.

Reason

- Excellent TypeScript support
- Migration system
- Type-safe queries
- Strong community

---

# ADR-007

Title

NestJS Backend

Status

Accepted

Decision

Use NestJS for the backend.

Reason

- Modular architecture
- Dependency Injection
- Scalable
- Excellent TypeScript support

---

# ADR-008

Title

Next.js Frontend

Status

Accepted

Decision

Use Next.js App Router.

Reason

- SSR
- SEO
- Routing
- Performance
- React ecosystem

---

# ADR-009

Title

Tailwind CSS

Status

Accepted

Decision

Use Tailwind CSS as the styling framework.

Reason

- Rapid development
- Consistency
- Easy maintenance
- Small production bundle

---

# ADR-010

Title

shadcn/ui

Status

Accepted

Decision

Use shadcn/ui as the component foundation.

Reason

- Accessible
- Customizable
- Modern
- No vendor lock-in

---

# ADR-011

Title

REST API

Status

Accepted

Decision

Expose REST APIs.

Reason

- Simpler implementation
- Easy integration
- Widely supported
- Fits project requirements

---

# ADR-012

Title

Authentication

Status

Accepted

Decision

JWT Access Token with Refresh Token.

Reason

- Stateless authentication
- Secure
- Scalable

---

# ADR-013

Title

State Management

Status

Accepted

Decision

Use

- TanStack Query for server state
- Zustand for client state

Reason

Clear separation of responsibilities.

---

# ADR-014

Title

Object Storage

Status

Accepted

Decision

Store uploaded files in S3-compatible object storage.

Reason

- Scalable
- Reliable
- CDN friendly

---

# ADR-015

Title

Image Optimization

Status

Accepted

Decision

Generate multiple image sizes.

Formats

- WebP
- AVIF

Reason

Better performance.

---

# ADR-016

Title

Component-First Development

Status

Accepted

Decision

Build reusable components before pages.

Reason

- Less duplication
- Faster development
- Easier maintenance

---

# ADR-017

Title

Repository Pattern

Status

Accepted

Decision

Repositories are the only layer allowed to access Prisma.

Reason

- Separation of concerns
- Easier testing
- Better maintainability

---

# ADR-018

Title

Module-Based Architecture

Status

Accepted

Decision

Each business domain has its own module.

Examples

- Products
- Orders
- Customers
- Checkout

Reason

Scalability.

---

# ADR-019

Title

Bangladesh Checkout

Status

Accepted

Decision

Version 1 checkout supports

- Cash on Delivery
- bKash
- Nagad
- Rocket
- SSLCommerz

Reason

Target market is Bangladesh.

---

# ADR-020

Title

Compatibility System

Status

Accepted

Decision

Motorcycle compatibility is stored as structured relationships.

Never as free text.

Reason

Accurate filtering

Scalable

Future Bike Garage support

---

# ADR-021

Title

Attribute Architecture

Status

Accepted

Decision

Attributes and Specifications are separate concepts.

Reason

Attributes

- Searchable
- Filterable

Specifications

- Informational only

---

# ADR-022

Title

Order Snapshots

Status

Accepted

Decision

Orders store a snapshot of product information.

Reason

Historical accuracy.

Order history never changes after purchase.

---

# ADR-023

Title

Documentation First

Status

Accepted

Decision

Architecture is documented before implementation.

Reason

- Clear direction
- Better AI collaboration
- Easier onboarding
- Reduced rework

---

# ADR-024

Title

Version 1 Scope

Status

Accepted

Decision

MotoHub Version 1 focuses only on motorcycle parts and accessories.

Excluded

- Marketplace
- Mobile App
- Loyalty Program
- Wholesale
- Product Bundles
- Multi-vendor

Reason

Reduce complexity and ship faster.

---

# Future Decisions

Record future architectural decisions using this format.

---

## ADR-XXX

Title

Status

Decision

Reason

Alternatives Considered

Impact

Date

Approved By

Related Documents

---

# Decision Rules

Every major architectural change must

- Receive approval
- Be documented
- Include rationale
- Reference affected documents

---

# Current Status

Accepted Decisions

24

Deprecated

0

Rejected

0

Pending

0
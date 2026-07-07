# MotoHub Backend Implementation Guide

Version: 1.0

Backend Framework: NestJS

Database: PostgreSQL

ORM: Prisma

---

# Purpose

This document defines the backend architecture, coding standards, project structure, and implementation order.

The backend should be modular, scalable, secure, and easy to maintain.

---

# Tech Stack

Framework

- NestJS

Language

- TypeScript

ORM

- Prisma

Database

- PostgreSQL

Cache

- Redis

Authentication

- JWT
- Refresh Tokens

Validation

- class-validator
- class-transformer

File Storage

- S3 Compatible Storage

Queue

- BullMQ + Redis

Logging

- Pino

API Documentation

- Swagger

Email

- Resend

Package Manager

- pnpm

---

# Project Structure

```
src/

├── modules/
├── common/
├── config/
├── prisma/
├── middleware/
├── guards/
├── decorators/
├── filters/
├── interceptors/
├── pipes/
├── jobs/
├── storage/
├── utils/
├── types/
└── main.ts
```

---

# Module Structure

Every module follows the same structure.

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

# Core Modules

Authentication

Users

Products

Categories

Brands

Search

Compatibility

Inventory

Pricing

Cart

Checkout

Orders

Payments

Reviews

Wishlist

Coupons

CMS

Media

Settings

Notifications

Dashboard

---

# Authentication

Use JWT Access Token

Use Refresh Token

Store Refresh Tokens securely

Password hashing

bcrypt

Never store plain-text passwords.

---

# Authorization

Roles

- Customer
- Admin
- Super Admin

Permissions handled using Guards.

---

# Validation

Every request must use DTO validation.

Reject invalid requests before reaching business logic.

---

# Business Logic

Controllers

Receive requests only.

Services

Contain business logic.

Repositories

Handle database operations.

Never access Prisma directly from controllers.

---

# Database Access

Only repositories communicate with Prisma.

```
Controller

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL
```

---

# API Documentation

Use Swagger.

Every endpoint must include

- Description
- Parameters
- Request Body
- Response
- Error Codes

---

# Error Handling

Use global exception filters.

Standardize responses.

Never expose stack traces.

---

# File Uploads

Supported

- Product Images
- Brand Logos
- Category Images
- CMS Images

Validate

- File Type
- File Size
- Image Dimensions

Generate optimized versions after upload.

---

# Image Processing

Generate

- Thumbnail
- Medium
- Large

Convert to

- WebP
- AVIF

Store metadata in Media Library.

---

# Search

Version 1

PostgreSQL Full Text Search

Future

Meilisearch

Search logic isolated in Search Module.

---

# Pricing

Pricing handled separately from Products.

Responsibilities

- Current Price
- Sale Price
- Scheduled Sales
- Price Validation

---

# Inventory

Inventory responsibilities

- Available Stock
- Reserved Stock
- Stock Transactions
- Low Stock Alerts

Inventory updates occur only through Inventory Service.

---

# Orders

Order Service responsibilities

- Create Order
- Update Status
- Generate Order Number
- Reserve Inventory
- Create Payment Record

---

# Payments

Supported

- Cash on Delivery
- bKash
- Nagad
- Rocket
- SSLCommerz

Payment providers isolated behind adapters.

Never couple checkout directly to payment gateways.

---

# Coupons

Responsibilities

- Validate Coupon
- Calculate Discount
- Track Usage
- Expiry Validation

---

# Notifications

Version 1

Email

Future

SMS

WhatsApp

Push Notifications

Notifications handled asynchronously.

---

# Queue Jobs

Use BullMQ.

Background Jobs

- Image Processing
- Email Sending
- Inventory Sync
- Cleanup Tasks

Never block API requests.

---

# Logging

Log

- Requests
- Errors
- Authentication
- Payments
- Order Status Changes

Do not log passwords or sensitive data.

---

# Security

- Helmet
- CORS
- Rate Limiting
- DTO Validation
- Password Hashing
- JWT
- Refresh Tokens
- Secure Cookies (if applicable)
- Input Sanitization

---

# Configuration

Use environment variables.

Examples

```
DATABASE_URL

JWT_SECRET

JWT_REFRESH_SECRET

REDIS_URL

S3_ENDPOINT

S3_BUCKET

SSLCOMMERZ_STORE_ID

SSLCOMMERZ_STORE_PASSWORD

BKASH_APP_KEY

BKASH_APP_SECRET

RESEND_API_KEY
```

---

# Caching

Cache

- Homepage
- Categories
- Brands
- Product Listings

Do not cache

- Cart
- Checkout
- Orders
- Payments

---

# Transactions

Use database transactions for

- Checkout
- Order Creation
- Inventory Updates
- Payment Updates

Prevent partial writes.

---

# Testing

Unit Tests

- Services
- Utilities

Integration Tests

- API Endpoints
- Database

E2E Tests

- Authentication
- Checkout
- Order Flow
- Admin Actions

---

# CI/CD

Pipeline

- Install Dependencies
- Lint
- Type Check
- Unit Tests
- Build
- Deploy

Deployment only if all checks pass.

---

# Deployment

Environment

- Ubuntu VPS
- Docker
- Coolify

Separate

- API
- PostgreSQL
- Redis

Use HTTPS only.

---

# Monitoring

Monitor

- API Health
- Database
- Redis
- Disk Usage
- Memory
- CPU

Add uptime monitoring.

---

# Build Order

## Phase 1

- Project Setup
- Prisma
- Authentication
- Users

---

## Phase 2

- Categories
- Brands
- Products
- Media

---

## Phase 3

- Search
- Compatibility
- Pricing
- Inventory

---

## Phase 4

- Cart
- Wishlist
- Coupons

---

## Phase 5

- Checkout
- Orders
- Payments

---

## Phase 6

- Reviews
- CMS
- Dashboard
- Settings

---

## Phase 7

- Queue Jobs
- Email
- Caching
- Performance
- Security
- Testing

---

# Coding Standards

- TypeScript Strict Mode
- SOLID Principles
- Dependency Injection
- Repository Pattern
- No business logic in controllers
- Small, focused services
- Consistent error handling
- Reusable DTOs

---

# Definition of Done

A backend feature is complete when:

- API implemented
- Validation complete
- Authorization implemented
- Database integrated
- Transactions handled
- Error handling implemented
- Tests passing
- Swagger documented
- Code reviewed

---

# Backend Milestones

Milestone 1

Foundation

Milestone 2

Catalog

Milestone 3

Commerce

Milestone 4

Administration

Milestone 5

Optimization & Production
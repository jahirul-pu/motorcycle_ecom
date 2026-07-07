# PROJECT_CONTEXT.md

# MotoHub Project Context

Version: 1.0

Last Updated: July 2026

Status: Active Development

---

# Project Overview

MotoHub is a modern ecommerce platform focused exclusively on motorcycle parts and accessories.

The platform is inspired by FortNine and is designed specifically for the Bangladeshi market.

MotoHub emphasizes

- Fast browsing
- Detailed product information
- Excellent search
- Motorcycle compatibility
- Simple checkout
- Modern UI
- High performance

---

# Business Goal

Build the best motorcycle parts and accessories ecommerce platform in Bangladesh.

MotoHub should become the first choice for riders looking for genuine parts, riding gear, accessories, maintenance products, and workshop essentials.

---

# Version 1 Scope

MotoHub Version 1 includes

- Motorcycle Parts
- Motorcycle Accessories

Only.

---

# Version 1 Features

Customer

- Browse Categories
- Browse Brands
- Search Products
- Product Filters
- Product Details
- Compatibility Information
- Wishlist
- Shopping Cart
- Checkout
- Customer Account
- Order History
- Product Reviews

Admin

- Dashboard
- Products
- Categories
- Brands
- Orders
- Customers
- Reviews
- Coupons
- CMS Pages
- Store Settings

---

# Excluded From Version 1

Do NOT build

- Marketplace
- Multi Vendor
- Mobile App
- Wholesale Portal
- Dealer Portal
- Loyalty Program
- Reward Points
- Referral System
- Subscription Products
- Product Bundles
- AI Shopping Assistant
- Service Booking
- Bike Garage
- Compare Products

These belong to future versions unless documentation changes.

---

# Target Audience

Primary

Motorcycle owners in Bangladesh.

Secondary

- Workshops
- Mechanics
- Enthusiasts
- Touring riders

---

# Target Country

Bangladesh

---

# Supported Language

Version 1

English

Future

Bangla

---

# Currency

BDT

Bangladeshi Taka

---

# Supported Payments

- Cash on Delivery
- bKash
- Nagad
- Rocket
- SSLCommerz

---

# Shipping

Bangladesh only.

---

# Business Model

Direct ecommerce.

MotoHub owns and sells inventory.

Version 1 is NOT a marketplace.

---

# Inspiration

Primary Inspiration

FortNine

Design inspiration only.

MotoHub should have its own identity.

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

Deployment

- Docker
- Coolify

---

# Design Philosophy

- Modern
- Minimal
- Dark accents
- Product focused
- Clean typography
- Large product imagery
- Fast interactions
- Mobile-first

---

# Performance Targets

Homepage

<2 seconds

Product Page

<2 seconds

API

<300ms average response

Lighthouse

90+

---

# SEO Goals

Every public page must include

- Metadata
- Open Graph
- Canonical URL
- Structured Data
- Optimized URLs

---

# Accessibility Goals

Support

- Keyboard navigation
- Screen readers
- Semantic HTML
- Visible focus states

WCAG AA compliance where practical.

---

# Product Philosophy

Products should be

- Easy to discover
- Easy to compare mentally
- Rich in information
- Easy to purchase

---

# Catalog Structure

Department

↓

Category

↓

Subcategory

↓

Product

---

# Product Model

Each product contains

- Basic Information
- Images
- Pricing
- Inventory
- Attributes
- Specifications
- Compatibility
- Reviews

These are separate modules.

---

# Compatibility Philosophy

Compatibility is stored as structured relationships.

Never as plain text.

Customers should immediately know whether a product fits their motorcycle.

---

# Search Philosophy

Search should prioritize

- Product Name
- SKU
- Brand
- Category

Version 1

PostgreSQL Full Text Search

Future

Meilisearch

---

# Checkout Philosophy

Simple.

Fast.

Minimal steps.

Optimized for Bangladeshi customers.

---

# UI Philosophy

Avoid unnecessary animations.

Avoid clutter.

Prioritize readability.

Keep actions obvious.

---

# Coding Philosophy

- Simple
- Predictable
- Modular
- Reusable
- Strongly Typed

---

# Database Philosophy

- PostgreSQL
- UUID Keys
- Normalized
- Indexed
- Transaction Safe

---

# API Philosophy

REST

Versioned

Consistent responses

Consistent errors

JWT authentication

---

# Documentation Philosophy

Documentation is part of the product.

Documentation must always match implementation.

---

# AI Development Philosophy

AI should

- Read documentation first
- Reuse existing code
- Never invent features
- Never duplicate components
- Follow architecture exactly

---

# Current Project Status

Planning

Completed

Documentation

Completed

Architecture

Completed

Implementation

Not Started

Testing

Not Started

Deployment

Not Started

---

# Current Documentation

Completed

- Product Requirements
- Features
- User Flow
- Design
- Components
- Catalog Architecture
- Compatibility Architecture
- Attribute Architecture
- Pages
- API
- Database
- Frontend Implementation
- Backend Implementation
- Roadmap
- Coding Standards
- Security
- Testing
- Deployment
- Environment Setup
- Project Structure
- Decisions
- References
- AI Context

---

# Development Workflow

Read documentation

↓

Plan implementation

↓

Build feature

↓

Test feature

↓

Review feature

↓

Update documentation

↓

Merge

---

# Definition of Success

MotoHub Version 1 is successful when

- Customers can easily discover products.
- Customers can confidently purchase products.
- Administrators can manage the business without developer assistance.
- The platform is fast, reliable, secure, and easy to maintain.
- The architecture supports future expansion without major rewrites.

---

# Guiding Principle

When making any technical or product decision, prefer the solution that is simpler, more maintainable, and fully aligned with the existing documentation.

If a proposed feature or implementation is not documented, it should not be added until the documentation is updated.
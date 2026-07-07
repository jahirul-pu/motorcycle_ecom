# PHASE_03_CATALOG.md

Version: 1.0

Estimated Duration: 10–14 Days

Status: Not Started

Priority: Critical

Depends On

- Phase 01 Foundation
- Phase 02 Authentication

---

# Objective

Build the complete product catalog.

By the end of this phase, customers should be able to

- Browse Categories
- Browse Brands
- Browse Products
- View Product Details
- View Product Images
- View Product Specifications
- View Compatibility
- View Pricing
- View Inventory Status

No shopping functionality should be implemented.

---

# Deliverables

✓ Category System

✓ Brand System

✓ Product System

✓ Product Images

✓ Product Pricing

✓ Inventory

✓ Product Specifications

✓ Product Attributes

✓ Motorcycle Compatibility

✓ SEO URLs

---

# Success Criteria

Customers can browse the complete catalog without purchasing products.

---

# Milestone 1

Category Module

Status

⬜

---

Database

```
categories
```

---

Backend

Create

```
Category Module

Category Controller

Category Service

Category Repository

Category DTOs

Category Validation
```

---

Frontend

Create

```
Category Navigation

Category Cards

Category Sidebar

Breadcrumb Navigation
```

---

API

```
GET /categories

GET /categories/:slug
```

---

Deliverable

Category system complete.

---

# Milestone 2

Brand Module

Status

⬜

---

Database

```
brands
```

---

Backend

```
Brand Module

Brand CRUD

Brand Validation
```

---

Frontend

```
Brand Listing

Brand Page

Brand Logo Grid
```

---

API

```
GET /brands

GET /brands/:slug
```

---

Deliverable

Brand system complete.

---

# Milestone 3

Product Module

Status

⬜

---

Database

```
products
```

---

Backend

```
Product Module

Repository

Service

DTOs

Validation

Mappers
```

---

Frontend

```
Product Cards

Product Grid

Product List

Product Skeleton
```

---

API

```
GET /products

GET /products/:slug
```

---

Deliverable

Product module complete.

---

# Milestone 4

Media Library

Status

⬜

---

Database

```
media

product_images
```

---

Backend

Create

```
Image Upload

Image Resize

Image Optimization

Image Deletion

Image Ordering
```

---

Frontend

```
Gallery

Thumbnail Strip

Zoom

Fullscreen Preview
```

---

Deliverable

Media system complete.

---

# Milestone 5

Pricing Module

Status

⬜

---

Database

```
prices
```

---

Backend

Implement

```
Regular Price

Sale Price

Sale Dates

Currency
```

---

Frontend

Display

```
Price

Sale Price

Discount Badge
```

---

Deliverable

Pricing complete.

---

# Milestone 6

Inventory Module

Status

⬜

---

Database

```
inventories

inventory_transactions
```

---

Backend

Implement

```
Stock

Availability

Low Stock

Reservation Infrastructure
```

---

Frontend

Display

```
In Stock

Low Stock

Out of Stock
```

---

Deliverable

Inventory complete.

---

# Milestone 7

Attributes

Status

⬜

---

Database

```
attributes

attribute_options

product_attributes
```

---

Backend

CRUD

Assignment

Filtering Support

---

Frontend

Display

```
Color

Size

Material

Viscosity

Etc.
```

---

Deliverable

Attributes complete.

---

# Milestone 8

Specifications

Status

⬜

---

Database

```
specifications

product_specifications
```

---

Frontend

Specifications Table

---

Deliverable

Specification system complete.

---

# Milestone 9

Motorcycle Compatibility

Status

⬜

---

Database

```
motorcycle_brands

motorcycle_models

motorcycle_generations

motorcycle_variants

product_compatibility
```

---

Backend

Compatibility Engine

Lookup API

Validation

---

Frontend

Compatibility Card

Supported Bikes

Model List

Year Range

---

Deliverable

Compatibility complete.

---

# Milestone 10

Product Details Page

Status

⬜

---

Sections

```
Gallery

Title

Brand

SKU

Price

Availability

Compatibility

Description

Specifications

Attributes

Related Products
```

---

Deliverable

Complete product page.

---

# Milestone 11

Category Pages

Status

⬜

---

Pages

```
Category Landing

Subcategory Listing

Category Grid

Pagination
```

---

Deliverable

Category browsing.

---

# Milestone 12

Brand Pages

Status

⬜

---

Pages

```
Brand Landing

Brand Products

Brand Information
```

---

Deliverable

Brand browsing.

---

# Milestone 13

SEO

Status

⬜

---

Implement

```
Metadata

Canonical URLs

Open Graph

JSON-LD Product Schema

Breadcrumb Schema
```

---

Deliverable

SEO ready.

---

# API Endpoints

```
GET /categories

GET /categories/:slug

GET /brands

GET /brands/:slug

GET /products

GET /products/:slug

GET /products/:id/images

GET /products/:id/specifications

GET /products/:id/compatibility
```

---

# Frontend Pages

```
/

Categories

Category Details

Brands

Brand Details

Products

Product Details
```

---

# Components

```
CategoryCard

BrandCard

ProductCard

ProductGrid

ProductGallery

Price

StockBadge

CompatibilityCard

SpecificationTable

Breadcrumb

ProductSkeleton
```

---

# Forbidden During Phase 3

Do NOT build

Cart

Wishlist

Checkout

Orders

Payments

Reviews

Search

Admin Dashboard

Coupons

Customer Dashboard

---

# Testing

Verify

- Category Navigation
- Brand Navigation
- Product Listing
- Product Details
- Image Gallery
- Price Display
- Inventory Status
- Compatibility Display
- SEO Metadata
- Responsive Layout

---

# Phase Exit Checklist

Category Module

Brand Module

Product Module

Media Library

Pricing

Inventory

Attributes

Specifications

Compatibility

SEO

Responsive UI

Tests Passing

Documentation Updated

---

# Definition of Done

Phase 3 is complete when customers can browse the complete MotoHub catalog—including categories, brands, products, images, specifications, pricing, inventory, and motorcycle compatibility—with a fast, responsive, SEO-friendly experience, without any purchasing functionality.
# DATABASE.md

# MotoHub Database Architecture

Version: 1.0

Database: PostgreSQL 16+

ORM: Prisma

Status: Production Ready

---

# Purpose

This document defines the database architecture for MotoHub.

It serves as the single source of truth for all database entities, relationships, constraints, indexes, and conventions.

The database is designed to be

- Normalized
- Scalable
- Maintainable
- Extensible

---

# Database Principles

- PostgreSQL is the primary database.
- UUID primary keys for all business entities.
- Soft deletes where appropriate.
- Foreign key constraints enforced.
- Indexed for common queries.
- Audit timestamps on every table.
- Business logic belongs in the application layer, not the database.

---

# Naming Convention

Tables

Plural

Examples

```
products

orders

customers
```

Columns

snake_case

Examples

```
created_at

updated_at

brand_id
```

Primary Key

```
id UUID
```

Foreign Keys

```
product_id

category_id

brand_id
```

---

# Common Columns

Unless stated otherwise, every table contains

```
id

created_at

updated_at
```

Optional

```
deleted_at
```

---

# Core Modules

Version 1 consists of

```
Users

Authentication

Categories

Brands

Products

Attributes

Specifications

Compatibility

Pricing

Inventory

Media

Cart

Wishlist

Coupons

Orders

Payments

Reviews

CMS

Settings
```

---

# Entity Relationship Diagram

```
Category
    │
    │
    ▼
 Product
    │
    ├──────── Brand
    │
    ├──────── Price
    │
    ├──────── Inventory
    │
    ├──────── Media
    │
    ├──────── Attributes
    │
    ├──────── Specifications
    │
    ├──────── Compatibility
    │
    └──────── Reviews

Customer

├── Wishlist

├── Cart

├── Orders

└── Addresses

Orders

├── Order Items

├── Payments

└── Coupons
```

---

# User Module

## users

Stores customer and administrator accounts.

Fields

```
id

name

email

phone

password_hash

role

is_active

email_verified_at

last_login_at

created_at

updated_at
```

Indexes

```
email

phone

role
```

---

## refresh_tokens

Stores active refresh tokens.

Fields

```
id

user_id

token

expires_at

created_at
```

---

# Category Module

## categories

Fields

```
id

parent_id

name

slug

description

image_id

sort_order

is_active

seo_title

seo_description

created_at

updated_at
```

Supports unlimited nesting.

---

# Brand Module

## brands

Fields

```
id

name

slug

logo_id

description

website

is_active

created_at

updated_at
```

---

# Product Module

## products

Stores product information only.

Does NOT store

- Price
- Inventory

Fields

```
id

brand_id

category_id

sku

name

slug

short_description

description

status

weight

seo_title

seo_description

created_at

updated_at
```

Indexes

```
slug

sku

brand_id

category_id
```

---

# Product Media

## product_images

Fields

```
id

product_id

media_id

position

is_primary

created_at
```

---

# Pricing Module

## prices

Fields

```
id

product_id

regular_price

sale_price

sale_start

sale_end

currency

created_at

updated_at
```

Only one active price per product.

---

# Inventory Module

## inventories

Fields

```
id

product_id

available_quantity

reserved_quantity

low_stock_threshold

created_at

updated_at
```

---

## inventory_transactions

Tracks every inventory change.

Fields

```
id

inventory_id

type

quantity

reference

created_at
```

Types

```
Purchase

Sale

Adjustment

Reservation

Release
```

---

# Attributes

## attributes

Defines available attributes.

Example

```
Color

Material

Viscosity

Helmet Size
```

---

## attribute_options

Possible values.

Example

```
Black

Red

Blue
```

---

## product_attributes

Assigns attributes to products.

---

# Specifications

## specifications

Specification definitions.

---

## product_specifications

Stores specification values.

Examples

```
Weight

Country

Dimensions

Certification
```

Specifications are NOT filterable.

---

# Compatibility

## motorcycle_brands

Examples

Honda

Yamaha

Suzuki

---

## motorcycle_models

Examples

R15

CBR150R

GSX-R150

---

## motorcycle_generations

Optional.

---

## motorcycle_variants

ABS

Non-ABS

Special Edition

---

## product_compatibility

Maps products to motorcycles.

Fields

```
product_id

brand_id

model_id

generation_id

variant_id

year_from

year_to
```

---

# Media

## media

Stores uploaded files.

Fields

```
id

filename

mime_type

size

width

height

storage_key

created_at
```

---

# Wishlist

## wishlists

Customer wishlist.

Fields

```
user_id

product_id
```

Unique

```
user_id

product_id
```

---

# Cart

## carts

Shopping cart.

---

## cart_items

Fields

```
cart_id

product_id

quantity
```

---

# Addresses

## addresses

Fields

```
user_id

recipient_name

phone

address_line_1

address_line_2

area

city

postal_code

country

is_default
```

---

# Orders

## orders

Fields

```
id

order_number

user_id

status

subtotal

discount

shipping

total

payment_status

shipping_status

address_snapshot

created_at
```

Status

```
Pending

Confirmed

Packed

Shipped

Delivered

Cancelled

Returned
```

---

## order_items

Stores product snapshots.

Fields

```
order_id

product_id

sku

name

price

quantity

subtotal
```

---

# Payments

## payments

Fields

```
id

order_id

method

gateway

transaction_id

amount

status

paid_at

created_at
```

Methods

```
Cash on Delivery

bKash

Nagad

Rocket

SSLCommerz
```

---

# Coupons

## coupons

Fields

```
id

code

type

value

minimum_order

maximum_discount

usage_limit

expires_at

is_active
```

---

## coupon_usages

Tracks coupon usage.

---

# Reviews

## reviews

Fields

```
id

product_id

user_id

rating

title

review

is_approved

created_at
```

Only verified purchasers may review.

---

# CMS

## pages

Static pages.

Examples

```
About

Contact

Privacy Policy

Return Policy
```

---

## banners

Homepage banners.

---

# Settings

## settings

Simple key-value store.

Example

```
store_name

support_email

currency

tax_rate
```

---

# Relationships

```
Category

1 → N Products

Brand

1 → N Products

Product

1 → N Images

Product

1 → 1 Inventory

Product

1 → 1 Price

Product

N ↔ N Attributes

Product

N ↔ N Compatibility

Customer

1 → N Orders

Order

1 → N Order Items

Order

1 → 1 Payment
```

---

# Indexes

Create indexes on

```
slug

sku

email

phone

category_id

brand_id

product_id

user_id

order_number

transaction_id
```

---

# Constraints

- UUID primary keys
- Foreign keys enforced
- Unique slugs
- Unique SKU
- Positive inventory
- Positive prices
- Unique wishlist entries
- Unique coupon codes

---

# Transactions

Database transactions required for

- Checkout
- Payment confirmation
- Inventory reservation
- Order cancellation
- Refund processing

---

# Soft Deletes

Enable for

- Products
- Categories
- Brands
- Customers

Do not soft delete

- Orders
- Payments
- Inventory Transactions

---

# Seeding

Seed data includes

- Categories
- Brands
- Motorcycle Brands
- Motorcycle Models
- Attributes
- Specifications
- Settings

---

# Backup Strategy

Daily

- PostgreSQL database

Weekly

- Media metadata

Monthly

- Full database archive

---

# Performance Guidelines

- Use indexes for frequently queried columns.
- Use pagination for all listing queries.
- Avoid N+1 queries.
- Use eager loading only when necessary.
- Cache read-heavy queries with Redis.

---

# Migration Rules

- Every schema change requires a Prisma migration.
- Never edit an applied migration.
- Use descriptive migration names.
- Test migrations before production deployment.

---

# Definition of Complete

The MotoHub database is complete when

- Every business entity has a dedicated table.
- All relationships are normalized.
- Constraints are enforced.
- Indexes support expected query patterns.
- Schema matches API and business requirements.
- No business logic is implemented in the database.
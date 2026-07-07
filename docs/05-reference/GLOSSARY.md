# GLOSSARY.md

# MotoHub Glossary

Version: 1.0

---

# Purpose

This document defines the terminology used throughout MotoHub.

Use these terms consistently across documentation, code, APIs, and the UI.

---

# A

## Access Token

A short-lived JWT used to authenticate API requests.

---

## Admin

A user with permission to manage the MotoHub platform.

---

## API

Application Programming Interface used by the frontend and external services.

---

## Attribute

A filterable property of a product.

Examples

- Color
- Size
- Material
- Viscosity

---

## Attribute Set

A predefined collection of attributes assigned to a product category.

Example

Helmet Attribute Set

---

# B

## Banner

A promotional image displayed on the website.

---

## Brand

The manufacturer or company that produces a product.

Examples

- Motul
- NGK
- Yamaha Genuine Parts

---

# C

## Cart

A temporary collection of products before checkout.

---

## Category

A logical grouping of products.

Examples

- Helmets
- Engine Oil
- Brake Pads

---

## Compatibility

The structured relationship between a product and one or more motorcycles.

---

## Coupon

A promotional code that reduces the order total.

---

## Customer

A registered user who purchases products.

---

# D

## Department

The highest level of the product catalog.

Examples

- Parts
- Accessories
- Riding Gear

---

# E

## Endpoint

A specific API route.

Example

```
GET /products
```

---

# F

## Featured Product

A product highlighted on the homepage or category pages.

---

## Filter

A search refinement option.

Examples

- Brand
- Price
- Size
- Color

---

# G

## Gallery

The collection of images displayed on a product page.

---

# H

## Homepage

The main landing page of MotoHub.

---

# I

## Inventory

The available stock of a product.

---

## Inventory Reservation

Stock temporarily reserved during checkout.

---

# J

## JWT

JSON Web Token used for authentication.

---

# L

## Listing Page

A page displaying multiple products.

Examples

- Category Page
- Brand Page
- Search Results

---

# M

## Media Library

The centralized storage for uploaded images and files.

---

## Motorcycle

A structured representation of a vehicle used for compatibility.

Includes

- Manufacturer
- Model
- Generation
- Variant
- Engine
- Year Range

---

# O

## Order

A completed purchase made by a customer.

---

## Order Item

An individual product within an order.

Stores a snapshot of the purchased product.

---

# P

## Pagination

Breaking large collections into pages.

---

## Payment Gateway

A third-party payment provider.

Examples

- SSLCommerz
- bKash
- Nagad
- Rocket

---

## Product

A sellable item in the catalog.

---

## Product Card

The reusable UI component displaying a product summary.

---

## Product Snapshot

A copy of product information stored with an order to preserve historical accuracy.

---

# Q

## Query Parameter

Parameters appended to a URL.

Example

```
?page=1&limit=20
```

---

# R

## Refresh Token

A long-lived token used to obtain a new access token.

---

## Repository

The backend layer responsible for database access.

---

## Responsive Design

A layout that adapts to different screen sizes.

---

# S

## Search

Finding products using keywords and filters.

---

## Service

The backend layer containing business logic.

---

## SKU

Stock Keeping Unit.

A unique product identifier.

---

## Slug

A URL-friendly identifier.

Example

```
motul-7100-10w40
```

---

## Specification

Informational product data.

Examples

- Weight
- Dimensions
- Country of Origin

Specifications are not filterable.

---

# T

## Token

A digital credential used for authentication.

---

## Transaction

A database operation that either completes successfully or rolls back entirely.

---

# U

## User

A registered account.

Types

- Customer
- Admin
- Super Admin

---

# V

## Variant

A variation of a motorcycle or product.

Examples

Motorcycle

- ABS
- Non-ABS

Future Product Variant

- Small
- Medium
- Large

---

# W

## Warehouse

The physical location where inventory is stored.

Reserved for future expansion.

---

## Wishlist

A customer's saved products.

---

# Terminology Rules

Use

- Category

Do not use

- Collection

unless referring to frontend UI collections.

---

Use

- Compatibility

Do not use

- Fitment

for Version 1 documentation.

---

Use

- Customer

Do not use

- Buyer
- Shopper
- Consumer

---

Use

- Product

Do not use

- Item
- Goods

unless context requires it.

---

Use

- Order

Do not use

- Purchase

when referring to stored order records.

---

# Definition of Complete

Every business term used in MotoHub should have a single, well-defined meaning documented in this glossary.
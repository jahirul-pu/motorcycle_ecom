# CATALOG_ARCHITECTURE.md

# MotoHub Catalog Architecture

Version: 1.0

Status: Draft

---

# Purpose

The catalog is the heart of MotoHub.

Everything else depends on it.

The database.

The frontend.

The filters.

The search engine.

SEO.

Navigation.

Inventory.

Orders.

Admin.

This document defines how products are organized before designing the database.

---

# Catalog Philosophy

MotoHub is a motorcycle product catalog.

Not a database of random products.

The catalog must make it easy for customers to discover products while making it easy for administrators to maintain thousands of products.

Every decision should improve one of these:

- Product discovery
- Product management
- Search
- SEO
- Filtering
- Future scalability

---

# Catalog Hierarchy

Store

↓

Department

↓

Category

↓

Subcategory

↓

Product

---

Example

Parts

↓

Engine

↓

Air Filter

↓

Yamaha R15 V4 High Flow Air Filter

---

Example

Accessories

↓

Phone Holder

↓

Handlebar Mount

↓

BOBO BM4 Phone Holder

---

Example

Riding Gear

↓

Helmet

↓

Full Face Helmet

↓

MT Thunder 4 SV

---

# Departments

Version 1

Parts

Accessories

Riding Gear

Maintenance

Luggage

Electronics

Security

Apparel

---

Departments are fixed.

Administrators cannot create new departments.

This keeps navigation consistent.

---

# Category Structure

Unlimited nesting is technically supported.

However, Version 1 recommends a maximum of

Department

↓

Category

↓

Subcategory

Deep category trees reduce usability.

---

# Product Types

Version 1 supports

Simple Product

---

Not Supported

Variable Products

Grouped Products

Bundle Products

Digital Products

Subscription Products

Rental Products

Auction Products

Future versions may introduce additional product types.

---

# Product Identity

Every product must have

Unique ID

SKU

Slug

Product Name

Brand

Category

Primary Image

Status

Price

Stock

No product can exist without these fields.

---

# Product Naming Standard

Formula

Brand

+

Model

+

Product Type

+

Variant

Example

Yamaha R15 V4 Air Filter

Motul 7100 10W40 Engine Oil

LS2 FF800 Storm Helmet Matte Black

Avoid unnecessary marketing words.

Avoid ALL CAPS.

Avoid duplicate names.

---

# SKU Standard

Recommended Format

MH-BRAND-CATEGORY-000001

Example

MH-YAM-AIR-000152

SKU must never change after publication.

---

# URL Structure

Categories

/category/helmets

/category/engine-oil

Brands

/brand/mt

/brand/motul

Products

/product/ls2-ff800-storm-matte-black

Simple.

Readable.

SEO friendly.

---

# Product Status

Draft

Published

Hidden

Archived

Out of Stock

Discontinued

---

Hidden

Visible only in Admin.

---

Archived

Cannot be purchased.

Remains for historical orders.

---

# Brand Structure

Every Brand contains

Name

Logo

Description

Website (optional)

Country

Status

SEO

Slug

---

# Category Structure

Every Category contains

Name

Description

Parent Category

Featured Image

Banner Image

SEO

Status

Display Order

---

# Product Information

## Basic Information

Product Name

SKU

Slug

Brand

Category

Price

Sale Price

Stock

Status

Warranty

Short Description

Long Description

---

## Specifications

Specifications are key-value pairs.

Example

Material

ABS Plastic

Weight

350g

Dimensions

12 x 6 x 4 cm

Color

Black

Voltage

12V

Power

30W

---

Never hardcode specification fields.

Specifications must remain flexible.

---

# Product Attributes

Attributes are searchable.

Examples

Color

Black

Blue

Red

---

Size

Small

Medium

Large

XL

---

Material

Steel

Plastic

Carbon Fiber

Aluminum

Leather

---

Finish

Matte

Gloss

Chrome

---

Attributes power filters.

Specifications provide information.

Never confuse the two.

---

# Bike Compatibility

One product can support

One bike

Multiple bikes

No bike

---

Compatibility fields

Manufacturer

Model

Generation

Year From

Year To

Engine CC

Variant (optional)

---

Example

Manufacturer

Yamaha

Model

R15

Generation

V4

Year

2022

Engine

155cc

---

Products without compatibility remain fully supported.

Example

Helmet

Phone Holder

Engine Oil

Cleaning Kit

---

# Product Images

Every product requires

Primary Image

Minimum

1

Maximum

20

---

Recommended Order

Primary

Front

Back

Side

Angle

Close-up

Packaging

Installed (optional)

---

Image Rules

White background preferred.

Square aspect ratio.

Minimum

1200 × 1200

Preferred

2000 × 2000

Formats

AVIF

WebP

JPEG

---

# Product Videos

Optional

Supported

YouTube

Future

Self-hosted

---

# Product Documents

Optional

Installation Manual

User Manual

Warranty Document

Datasheet

PDF only.

---

# Product Relationships

Related Products

Manual selection.

Same Category

Automatic.

Same Brand

Automatic.

Recently Viewed

Automatic.

Customers Also Bought

Future.

---

# Pricing Model

Required

Regular Price

Optional

Sale Price

Sale Start

Sale End

---

Displayed Price

If sale is active

↓

Sale Price

Else

↓

Regular Price

---

# Inventory

Track

Stock Quantity

Stock Status

Reserved Stock

Low Stock Threshold

---

Stock States

In Stock

Low Stock

Out of Stock

Discontinued

---

# Search Index

Every product indexes

Name

Brand

Category

SKU

Short Description

Specifications

Attributes

Compatibility

---

Search Priority

1

Product Name

2

SKU

3

Brand

4

Category

5

Compatibility

6

Specifications

---

# Filter Strategy

Version 1 Filters

Brand

Category

Price

Availability

Color

Material

Bike Compatibility

---

Filters appear only when relevant.

Example

Helmet

↓

Color Filter

Size Filter

Brand Filter

---

Engine Oil

↓

Viscosity Filter

Brand Filter

Volume Filter

---

Phone Holder

↓

Mount Type

Brand

Color

---

Never show empty filters.

---

# Sorting

Relevance

Newest

Price Low → High

Price High → Low

Best Selling

Name A-Z

Name Z-A

---

# SEO Rules

Every product requires

SEO Title

Meta Description

Slug

Canonical URL

Open Graph Image

Schema.org Product Data

---

# Category SEO

Every category requires

Title

Description

SEO Title

Meta Description

Canonical URL

---

# Brand SEO

Every brand requires

SEO Title

Meta Description

Description

Canonical URL

---

# Catalog Rules

A product belongs to one brand.

A product belongs to one category.

A product may belong to multiple bike models.

A product may have unlimited specifications.

A product may have unlimited attributes.

A product may have multiple images.

A product must always have one primary image.

A SKU is permanent.

A slug may change.

Archived products remain available in order history.

---

# Catalog Acceptance Criteria

✓ Product hierarchy is clear.

✓ Categories are easy to navigate.

✓ Products are easy to search.

✓ Filters remain relevant.

✓ Product data is structured.

✓ SEO is supported.

✓ Inventory is manageable.

✓ Catalog scales to 100,000+ products without redesign.
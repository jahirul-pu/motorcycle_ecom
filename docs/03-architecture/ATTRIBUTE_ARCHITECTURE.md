# ATTRIBUTE_ARCHITECTURE.md

# MotoHub Attribute & Specification Architecture

Version: 1.0

Status: Draft

---

# Purpose

Not every motorcycle product has the same properties.

A helmet has a size.

An engine oil has a viscosity.

A phone holder has a mounting type.

A brake pad has a position.

The system must support these differences without changing the database or code every time a new product type is introduced.

This document defines how MotoHub stores, displays, filters, validates, and manages product information.

---

# Core Principle

MotoHub separates product information into four categories.

1. Basic Information

Required for every product.

Example

Name

Price

Brand

Category

SKU

---

2. Attributes

Searchable

Filterable

Comparable

Examples

Color

Size

Material

Viscosity

Position

---

3. Specifications

Informational only.

Not used for filtering.

Examples

Weight

Dimensions

Country of Origin

Package Contents

---

4. Compatibility

Stored separately.

Defined in COMPATIBILITY_ARCHITECTURE.md.

---

# Data Model

Product

↓

Basic Information

↓

Attribute Set

↓

Attributes

↓

Specifications

↓

Compatibility

---

# Definitions

## Basic Information

Shared by every product.

Examples

Name

SKU

Brand

Category

Price

Sale Price

Stock

Warranty

Description

---

## Attributes

Purpose

Help customers filter products.

Examples

Helmet

Color

Black

Size

XL

Certification

DOT

---

Engine Oil

Viscosity

10W40

Volume

1 Liter

Synthetic Type

Fully Synthetic

---

Brake Pad

Position

Front

Material

Ceramic

---

Phone Holder

Mount Type

Handlebar

Phone Size

4–7 Inches

Charging

Wireless

---

Attributes are:

✔ Searchable

✔ Filterable

✔ Comparable

---

## Specifications

Purpose

Provide detailed product information.

Examples

Weight

Height

Length

Width

Manufacturer

Country

Packaging

Model Number

Barcode

Part Number

Installation Method

---

Specifications are:

Not searchable by default.

Not filterable.

Displayed on the product page.

---

# Attribute Sets

Every category has one Attribute Set.

Example

Helmet

↓

Helmet Attribute Set

---

Engine Oil

↓

Engine Oil Attribute Set

---

Brake Pad

↓

Brake Pad Attribute Set

---

This allows administrators to create products quickly.

---

# Helmet Attribute Set

Attributes

Brand

Color

Size

Certification

Shell Material

Visor Type

Weight Class

Finish

Specifications

Weight

Country

Warranty

Package Contents

---

# Engine Oil Attribute Set

Attributes

Viscosity

Volume

Oil Type

API Rating

JASO Rating

Specifications

Manufacturer

Country

Packaging

Shelf Life

---

# Riding Jacket Attribute Set

Attributes

Size

Color

Material

Season

Protection Level

Waterproof

Specifications

Weight

Armor Included

Country

---

# Phone Holder Attribute Set

Attributes

Mount Type

Charging

Rotation

Material

Phone Size

Specifications

Weight

Box Contents

Warranty

---

# Battery Attribute Set

Attributes

Voltage

Capacity

Battery Type

Maintenance

Terminal Position

Specifications

Dimensions

Weight

Country

Warranty

---

# Air Filter Attribute Set

Attributes

Filter Type

Material

Washable

Reusable

Specifications

Dimensions

Manufacturer

Country

---

# Brake Pad Attribute Set

Attributes

Front / Rear

Material

Performance Grade

Specifications

Manufacturer

Package Contents

---

# Chain Attribute Set

Attributes

Pitch

Link Count

Chain Type

Color

Specifications

Weight

Manufacturer

---

# Tire Attribute Set

Attributes

Width

Profile

Diameter

Tube Type

Position

Load Rating

Speed Rating

Specifications

Country

Weight

---

# Attribute Types

Text

Example

Material

---

Number

Example

Weight

---

Boolean

Yes

No

---

Color

Color Swatch

---

Size

Dropdown

---

Select

Single Option

---

Multi Select

Multiple Values

---

Measurement

mm

cm

Liter

Kg

---

Date

Manufacturing Date

---

URL

Manual

Manufacturer Page

---

# Validation

Every attribute defines

Data Type

Required

Default Value

Validation Rules

Display Order

---

Example

Viscosity

Type

Text

Required

Yes

---

Weight

Type

Decimal

Minimum

0

---

Color

Allowed Values

Black

Blue

Red

Gray

White

---

# Attribute Display

Product Page

Specifications Tab

↓

General

↓

Performance

↓

Dimensions

↓

Package

---

Never display a long unorganized list.

Group related information.

---

# Filter Generation

Filters are generated automatically from attributes.

Example

Helmet

↓

Color

↓

Size

↓

Brand

↓

Certification

---

Engine Oil

↓

Viscosity

↓

Volume

↓

Brand

↓

API Rating

---

Phone Holder

↓

Mount Type

↓

Wireless Charging

↓

Brand

---

Only show filters relevant to the current category.

---

# Search Index

Search should index

Product Name

Brand

SKU

Attributes

Compatibility

Short Description

Category

---

Specifications remain lower priority.

---

# Comparison

Attributes are compared.

Specifications are displayed.

Example

Helmet A

Helmet B

↓

Size

Weight

Certification

Material

Price

Warranty

---

# Admin Workflow

Choose Category

↓

Attribute Set loads automatically

↓

Fill Basic Information

↓

Fill Attributes

↓

Fill Specifications

↓

Upload Images

↓

Save

---

The administrator should never manually create attributes while adding a product.

---

# Attribute Management

Administrator can

Create Attribute

Edit Attribute

Disable Attribute

Reorder Attribute

Assign to Attribute Set

---

Deleting attributes is not allowed if products use them.

Attributes may only be archived.

---

# Attribute Rules

Every attribute has

Name

Slug

Type

Validation

Display Order

Filterable

Searchable

Comparable

Visible

Required

---

# Specification Rules

Every specification has

Name

Value

Unit (optional)

Display Order

Visible

---

Specifications are never used for filtering unless explicitly configured.

---

# Units

Standardize units.

Length

mm

cm

---

Weight

g

kg

---

Capacity

ml

Liter

---

Voltage

V

---

Current

Ah

---

Power

W

---

Temperature

°C

---

Never allow inconsistent units.

Example

Don't mix

1000 ml

1 Liter

in the same category.

---

# Display Order

Product Page

1

Price

2

Stock

3

Attributes

4

Compatibility

5

Description

6

Specifications

7

Reviews

---

# Future Support

The architecture supports

Variants

Bundles

Configurable Products

Product Comparison

Advanced Filters

PIM Integration

CSV Imports

ERP Integration

Without redesign.

---

# Acceptance Criteria

✓ Categories automatically load the correct Attribute Set.

✓ Attributes generate filters.

✓ Specifications remain informational.

✓ Administrators cannot create inconsistent product data.

✓ New categories can be added without database redesign.

✓ Search indexes important attributes.

✓ Product comparison works using shared attributes.

✓ The architecture scales to tens of thousands of products.

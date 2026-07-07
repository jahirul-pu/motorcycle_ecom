# COMPATIBILITY_ARCHITECTURE.md

# MotoHub Compatibility Architecture

Version: 1.0

Status: Draft

---

# Purpose

Compatibility is one of the most important features of MotoHub.

Customers don't buy parts by product name.

They buy parts for a motorcycle.

The system must answer questions like:

- Will this fit my bike?
- What other bikes does this fit?
- Show me all compatible parts.
- Show me all compatible accessories.

Compatibility must be accurate, searchable, scalable, and easy to maintain.

It should never rely on free-text descriptions.

---

# Core Principle

Compatibility is its own dataset.

It is **not** stored as plain text inside a product.

Instead, products reference motorcycles through structured relationships.

---

# Compatibility Hierarchy

Manufacturer

↓

Model

↓

Generation

↓

Variant (optional)

↓

Engine

↓

Production Year

---

Example

Yamaha

↓

R15

↓

V4

↓

M

↓

155cc

↓

2022

---

Example

Honda

↓

CBR150R

↓

2021 Facelift

↓

ABS

↓

149cc

↓

2021

---

# Motorcycle Data Structure

Every motorcycle is built from reusable components.

Manufacturer

↓

Model

↓

Generation

↓

Engine

↓

Year Range

↓

Variant

---

Instead of storing

```
Yamaha R15 V4 M ABS 2022
```

The database stores references.

Manufacturer ID

Model ID

Generation ID

Variant ID

Engine ID

Year Range ID

---

# Manufacturers

Examples

Yamaha

Honda

Suzuki

Kawasaki

TVS

Bajaj

Hero

Royal Enfield

KTM

CFMoto

Benelli

Keeway

Lifan

GPX

Runner

Walton

---

Manufacturer Fields

ID

Name

Slug

Logo

Country

Status

Display Order

SEO

---

# Models

Every model belongs to one manufacturer.

Examples

R15

FZS

FZ-X

MT-15

XSR155

CBR150R

CB150R

Hornet

Gixxer SF

Pulsar NS160

Apache RTR 160

---

Fields

ID

Manufacturer

Name

Slug

Description

Status

---

# Generations

A model can have multiple generations.

Example

R15

↓

V1

↓

V2

↓

V3

↓

V4

---

Example

Apache RTR

↓

Old

↓

4V

↓

4V Special Edition

---

Fields

ID

Model

Generation Name

Internal Code

Description

Year From

Year To

---

# Variants

Optional

Example

ABS

Non ABS

Race Edition

Monster Edition

Dark Edition

M

MotoGP Edition

---

Not every motorcycle has variants.

---

# Engines

Reusable.

Fields

ID

Engine CC

Fuel Type

Cooling

Cylinder Count

Transmission

Engine Code (optional)

---

Example

155cc

Liquid Cooled

Single Cylinder

6 Speed

---

# Production Years

Year Range

Start

End

Example

2018

2020

---

Example

2022

Present

---

# Motorcycle Identity

Every motorcycle should resolve into

Manufacturer

Model

Generation

Variant (optional)

Engine

Year Range

---

Display Example

Yamaha R15 V4 M (2022–Present)

---

# Product Compatibility

A product

↓

Supports

↓

Many Motorcycles

A motorcycle

↓

Supports

↓

Many Products

Relationship

Many-to-Many

---

Example

Air Filter

Compatible With

R15 V4

MT-15 V2

XSR155

---

Example

Helmet

No Compatibility Required

Universal

---

# Universal Products

Some products fit every motorcycle.

Examples

Helmet

Gloves

Phone Holder

Cleaning Kit

Riding Jacket

Backpack

Universal Mirror

Phone Charger

---

These products are marked

Universal = True

Compatibility not required.

---

# Compatible Products

Examples

Brake Pads

Chain Sprocket

Clutch Plate

Air Filter

Oil Filter

Fuel Pump

ECU

Brake Lever

Headlight Assembly

Radiator

---

Compatibility required.

---

# Compatibility Levels

Level 1

Universal

Level 2

Manufacturer

Example

Fits all Yamaha bikes.

Level 3

Model

Fits every R15.

Level 4

Generation

Fits R15 V4.

Level 5

Variant

Fits R15 V4 M.

---

Higher precision is preferred.

---

# Compatibility Rules

A product may support

One Motorcycle

Many Motorcycles

Entire Model

Entire Brand

Universal

---

The highest precision available should always be used.

---

# Search Behavior

Customer types

R15 V4 Brake Pads

Search should prioritize

Compatible brake pads.

---

Customer types

MT15 Air Filter

Search

↓

Compatible products.

---

Customer types

Helmet

Compatibility ignored.

---

# Product Page

Display

Compatible With

✓ Yamaha R15 V4

✓ Yamaha MT15 V2

✓ Yamaha XSR155

Show as clickable links.

---

If more than five motorcycles

Display

"+12 More Compatible Models"

---

# Compatibility Filter

Customers may filter by

Manufacturer

↓

Model

↓

Generation

↓

Variant

---

Selection updates dynamically.

---

# Smart Compatibility Selector

Future Ready

Manufacturer

↓

Model

↓

Generation

↓

Variant

↓

View Compatible Products

---

This becomes a future "Find Parts for My Bike" feature.

No redesign required.

---

# Admin Workflow

Product

↓

Compatibility

↓

Add Motorcycle

↓

Search

↓

Select

↓

Save

---

Bulk selection supported.

---

# Bulk Import

Future support

CSV

Excel

API

---

Administrators should not manually enter thousands of compatibility records.

---

# Compatibility Validation

Duplicate relationships not allowed.

Archived motorcycles remain linked.

Deleted motorcycles prohibited if products reference them.

---

# SEO

Generate pages such as

/parts/yamaha/r15-v4

/accessories/honda/cbr150r

These pages list only compatible products.

Excellent for organic search.

---

# Future Expansion

The architecture supports

Cars

Scooters

Adventure Bikes

Electric Bikes

ATVs

Without redesign.

---

# Acceptance Criteria

✓ No compatibility stored as plain text.

✓ Products support unlimited compatible motorcycles.

✓ Universal products remain simple.

✓ Search understands compatibility.

✓ Filters are compatibility-aware.

✓ Data is normalized.

✓ Future "Bike Garage" feature can be added without changing the schema.

✓ Compatible products are easy for administrators to manage.
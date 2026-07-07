# DESIGN.md

# MotoHub Design System

Version: 1.0

---

# Purpose

This document defines the visual language, interaction patterns, layouts, and reusable design principles of MotoHub.

It ensures every page feels like it belongs to the same product.

This document is the single source of truth for all UI decisions.

No UI should be created without following this design system.

---

# Design Philosophy

MotoHub should feel like a premium motorcycle retailer.

Not flashy.

Not minimal for the sake of minimalism.

Not corporate.

The design should inspire confidence while keeping the customer's attention on the products.

---

# Design Principles

## Product First

Products are always the primary content.

Nothing should compete with the product.

---

## Information First

Customers buy parts because of information.

Specifications, compatibility, pricing and availability should always be easy to find.

---

## Fast Over Fancy

Every animation must have a purpose.

Performance is more important than visual effects.

---

## Consistency

Spacing.

Typography.

Buttons.

Cards.

Forms.

Everything follows the same system.

---

## Predictability

Every interaction should behave exactly as users expect.

---

## Responsive

Every page should work equally well on

Mobile

Tablet

Laptop

Desktop

Large Desktop

---

# Brand Personality

MotoHub should communicate

Professional

Reliable

Technical

Modern

Premium

Approachable

Fast

---

# Visual Style

MotoHub uses

Clean layouts

Large product photography

Minimal decoration

Clear typography

Strong spacing

Limited color palette

Simple icons

Subtle shadows

No unnecessary gradients

---

# Color Palette

## Primary

MotoHub Red

```
#D71920
```

Purpose

Brand

Primary Buttons

Primary Links

Important Actions

---

## Primary Hover

```
#BF141A
```

---

## Secondary

```
#111111
```

Purpose

Navigation

Headings

Important Text

Icons

---

## Background

```
#F8F9FA
```

---

## Surface

```
#FFFFFF
```

Cards

Forms

Dropdowns

Modals

---

## Border

```
#E5E7EB
```

---

## Divider

```
#F1F3F5
```

---

## Text Primary

```
#111111
```

---

## Text Secondary

```
#6B7280
```

---

## Text Disabled

```
#9CA3AF
```

---

## Success

```
#16A34A
```

---

## Warning

```
#F59E0B
```

---

## Error

```
#DC2626
```

---

## Information

```
#2563EB
```

---

# Color Rules

Red is reserved for

Brand

Primary CTA

Sale Badges

Important Notifications

Never use red as a decorative accent.

---

Green is only used for

In Stock

Success Messages

Completed Orders

---

Yellow is only used for

Warnings

Low Stock

Limited Time Offers

---

Blue is only used for

Information

Links

Optional notices

---

# Typography

Primary Font

Inter

Fallback

system-ui

sans-serif

---

## Font Scale

Display

48

Hero Headlines

---

H1

40

Page Titles

---

H2

32

Section Titles

---

H3

28

Subsections

---

H4

24

Cards

---

H5

20

Small Sections

---

Body Large

18

---

Body

16

---

Small

14

---

Caption

12

---

Button

16

SemiBold

---

Input

16

Regular

---

# Font Weights

Regular

400

Medium

500

SemiBold

600

Bold

700

---

# Spacing System

Base Unit

8px

---

Scale

4

8

12

16

24

32

40

48

64

80

96

128

---

Rule

Always use spacing values from this scale.

Never use arbitrary values.

---

# Border Radius

Small

6

Medium

10

Large

16

Extra Large

24

Pill

999

---

# Shadows

Small

Cards

Dropdowns

---

Medium

Navigation

Dialogs

---

Large

Modal

Drawer

---

No heavy shadows.

---

# Borders

Default

1px

Solid

Border Color

---

Focus

2px

Primary Red

---

Disabled

Dashed

---

# Grid System

Desktop Container

1440px

---

Content Width

1280px

---

Large Sections

1200px

---

Reading Width

760px

---

# Columns

Desktop

12

Tablet

8

Mobile

4

---

# Responsive Breakpoints

Mobile

0-639

Tablet

640-1023

Laptop

1024-1279

Desktop

1280-1535

Wide

1536+

---

# Layout

Every page follows

Announcement

↓

Header

↓

Navigation

↓

Main Content

↓

Footer

---

Content Order

Most important information always appears first.

---

# Icons

Style

Outlined

Simple

Consistent Stroke Width

No decorative icons.

---

Recommended

Lucide Icons

---

# Buttons

Primary

Solid Red

White Text

---

Secondary

White

Black Border

---

Ghost

Transparent

---

Danger

Red Outline

---

Disabled

Gray

---

Loading

Spinner

Cannot be clicked.

---

# Form Controls

Inputs

Textarea

Checkbox

Radio

Select

Search

Number

Phone

Password

---

All inputs have

Label

Placeholder

Helper Text

Validation

Error State

Disabled State

---

# Cards

Cards have

White Background

Small Radius

Light Border

Small Shadow

Padding 24px

---

# Product Cards

Every product card includes

Product Image

Brand

Title

Price

Sale Price

Discount Badge

Stock Status

Wishlist Button

Add to Cart Button

---

Never include long descriptions.

---

# Product Images

Background

White

Aspect Ratio

1:1

Minimum Resolution

1200px

Support

Zoom

Gallery

Lazy Loading

WebP

AVIF

---

# Badges

Sale

New

Out of Stock

Limited Stock

Best Seller

---

Maximum two badges.

---

# Navigation

Desktop

Logo

Categories

Brands

Search

Wishlist

Account

Cart

---

Mobile

Logo

Search

Menu

Cart

---

Sticky Navigation

Enabled

---

# Search

Instant Suggestions

Keyboard Support

Recent Searches

Popular Searches

No Results Suggestions

---

# Product Listing

Desktop

4 Columns

Tablet

3 Columns

Mobile

2 Columns

---

Pagination

Bottom Only

No infinite scrolling.

---

# Product Page Layout

Desktop

Gallery | Product Information

Below

Description

Specifications

Reviews

Related Products

---

Mobile

Gallery

Information

Buttons

Tabs

Related Products

Reviews

---

# Cart

Desktop

Two Columns

Products | Summary

---

Mobile

Single Column

Summary stays at bottom.

---

# Checkout Layout

Desktop

Left

Customer Information

Shipping

Payment

Right

Sticky Order Summary

---

Mobile

Single Column

Order Summary collapsible.

---

# Animations

Maximum Duration

200ms

---

Allowed

Hover

Fade

Slide

Scale (small)

Accordion

Drawer

Toast

---

Avoid

Bounce

Elastic

Long transitions

Parallax

Auto-playing animations

---

# Loading States

Every page requires

Skeleton Loader

Image Placeholder

Button Loading

Search Loading

Cart Loading

---

# Empty States

Products

Wishlist

Orders

Search

Cart

Reviews

---

Every empty state includes

Illustration

Message

Primary Action

---

# Accessibility

Minimum Contrast

WCAG AA

Keyboard Navigation

Required

Focus Indicators

Required

Alt Text

Required

ARIA Labels

Required

Semantic HTML

Required

---

# Performance Targets

First Load

<2 seconds

CLS

<0.05

LCP

<2.5 seconds

Interaction

<200ms

---

# SEO Requirements

Semantic HTML

JSON-LD

Meta Tags

Canonical URLs

Open Graph

Twitter Cards

Breadcrumb Schema

Product Schema

---

# Design Rules

Never use more than one primary CTA in the same section.

Never place two competing actions beside each other.

Never hide important information behind hover effects.

Never rely on color alone to communicate meaning.

Never create custom UI when an existing component can be reused.

Consistency is more important than originality.

---

# Design Acceptance Criteria

✓ Every page follows the spacing system.

✓ Every component uses design tokens.

✓ Typography is consistent.

✓ Mobile and desktop layouts are defined.

✓ Accessibility requirements are met.

✓ Performance targets are considered during design.

✓ Components are reusable.

✓ Visual hierarchy is clear.

✓ Product information is always prioritized.

# ICONOGRAPHY.md

# MotoHub Iconography Guidelines

Version: 1.0

---

# Purpose

This document defines how icons are used throughout MotoHub.

Consistent icon usage improves usability, readability, and visual consistency.

---

# Icon Library

Version 1

- Lucide React

Do not mix multiple icon libraries.

---

# General Rules

- Use outline icons only.
- Maintain a consistent visual style.
- Pair icons with text where appropriate.
- Do not use icons as decoration only.

---

# Standard Sizes

Small

```
16px
```

Default

```
20px
```

Medium

```
24px
```

Large

```
32px
```

Extra Large

```
40px
```

Use only these predefined sizes.

---

# Stroke Width

Default

```
2
```

Do not customize stroke width unless required.

---

# Colors

Icons inherit the text color.

Use semantic colors only for

- Success
- Warning
- Error
- Information

Never hardcode icon colors.

---

# Navigation Icons

Examples

Home

Category

Brand

Search

Shopping Cart

Wishlist

User

Orders

Settings

Logout

Use the same icon everywhere.

---

# Product Icons

Examples

Package

Tag

Shield

Star

Truck

Box

Warranty

Compatibility

Inventory

Reviews

---

# Checkout Icons

Examples

Location

Credit Card

Wallet

Receipt

Coupon

Delivery

Success

Failure

---

# Customer Dashboard

Examples

Profile

Orders

Addresses

Wishlist

Notifications

Security

Password

---

# Admin Dashboard

Examples

Dashboard

Products

Categories

Brands

Customers

Orders

Analytics

Coupons

CMS

Settings

Logs

---

# Status Icons

Success

Check Circle

Warning

Triangle Alert

Error

Circle X

Information

Info

Loading

Loader Circle

---

# Action Icons

Add

Edit

Delete

Save

Upload

Download

Share

Copy

Filter

Sort

Refresh

Print

Export

Import

View

Hide

---

# Form Icons

Search

Calendar

Clock

Email

Phone

Lock

Unlock

Eye

Eye Off

User

---

# Table Icons

Sort

Filter

Expand

Collapse

Next Page

Previous Page

More

---

# File Icons

Image

PDF

Document

Archive

Spreadsheet

Video

Audio

---

# Empty States

Every empty state should use an appropriate icon.

Examples

No Products

No Orders

No Wishlist

No Reviews

No Search Results

No Notifications

---

# Icon Placement

Buttons

Icon left of text by default.

Icon-only buttons require an accessible label.

---

# Accessibility

Every icon-only button must include

```
aria-label
```

Decorative icons should be hidden from screen readers.

---

# Spacing

Maintain consistent spacing between icons and text.

Use spacing values from DESIGN_TOKENS.md.

---

# Hover States

Interactive icons should

- Change color
- Maintain contrast
- Show pointer cursor

---

# Disabled State

Disabled icons

- Reduced opacity
- Not clickable
- Preserve readability

---

# Animations

Allowed

- Loading Spinner
- Chevron Rotation
- Expand/Collapse

Avoid decorative animations.

---

# Custom Icons

Avoid creating custom icons.

Only create custom icons when

- Branding requires it
- No suitable Lucide icon exists

---

# SVG Rules

Use SVG only.

Do not use PNG icons.

Optimize custom SVG files before adding them.

---

# Naming Convention

Examples

```
HomeIcon

CartIcon

SearchIcon

OrderIcon

SettingsIcon
```

Keep naming consistent across the project.

---

# Definition of Complete

MotoHub iconography is complete when

- One icon library is used throughout the project
- Icons are visually consistent
- Icons are accessible
- Icons follow the design system
- No duplicate icons exist for the same purpose

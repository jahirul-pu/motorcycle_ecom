# DESIGN_TOKENS.md

# MotoHub Design Tokens

Version: 1.0

---

# Purpose

This document defines the visual design tokens used throughout MotoHub.

All UI components must use these tokens.

Never hardcode colors, spacing, or typography.

---

# Color Palette

## Primary

```
Primary 50
Primary 100
Primary 200
Primary 300
Primary 400
Primary 500
Primary 600
Primary 700
Primary 800
Primary 900
```

Used for

- Buttons
- Links
- Active States
- Highlights

---

## Neutral

```
Neutral 50
Neutral 100
Neutral 200
Neutral 300
Neutral 400
Neutral 500
Neutral 600
Neutral 700
Neutral 800
Neutral 900
```

Used for

- Text
- Backgrounds
- Borders
- Cards

---

## Semantic Colors

Success

```
Green
```

Warning

```
Yellow
```

Error

```
Red
```

Information

```
Blue
```

---

# Background Colors

Primary Background

Secondary Background

Card Background

Overlay Background

Disabled Background

---

# Text Colors

Primary Text

Secondary Text

Muted Text

Disabled Text

Inverse Text

---

# Border Colors

Default

Hover

Focus

Error

Success

---

# Shadows

Small

Medium

Large

Extra Large

No custom shadows outside these tokens.

---

# Border Radius

```
xs

sm

md

lg

xl

2xl

full
```

---

# Typography

Font Family

Primary

```
Inter
```

Fallback

```
System UI
```

---

# Font Sizes

```
xs

sm

base

lg

xl

2xl

3xl

4xl

5xl
```

---

# Font Weights

```
Regular

Medium

SemiBold

Bold
```

---

# Line Heights

```
Tight

Normal

Relaxed
```

---

# Letter Spacing

```
Normal

Wide

Wider
```

---

# Spacing Scale

```
0

1

2

4

6

8

10

12

16

20

24

32

40

48

64

80

96
```

Use only values from this scale.

---

# Container Widths

Small

Medium

Large

Extra Large

Full Width

---

# Grid

Columns

```
12
```

Gap

Uses spacing scale.

---

# Breakpoints

Mobile

```
0px
```

Small

```
640px
```

Medium

```
768px
```

Large

```
1024px
```

Extra Large

```
1280px
```

2XL

```
1536px
```

---

# Icon Sizes

```
16

20

24

32

40

48
```

---

# Button Heights

Small

Medium

Large

---

# Input Heights

Small

Medium

Large

---

# Z-Index Scale

```
Dropdown

Sticky

Overlay

Modal

Toast

Tooltip
```

Never use arbitrary z-index values.

---

# Animation Duration

Fast

```
150ms
```

Normal

```
250ms
```

Slow

```
350ms
```

---

# Animation Curves

Default

Ease In

Ease Out

Ease In Out

---

# Opacity

```
0%

25%

50%

75%

100%
```

---

# Image Aspect Ratios

Square

```
1:1
```

Product Card

```
4:5
```

Banner

```
16:9
```

Hero

```
21:9
```

Logo

```
Auto
```

---

# Product Images

Background

White

Format

WebP

Fallback

PNG

Maintain consistent aspect ratio.

---

# Elevation

Level 0

No Shadow

Level 1

Cards

Level 2

Dropdowns

Level 3

Modals

Level 4

Notifications

---

# Motion Principles

- Fast
- Smooth
- Subtle
- Functional

Avoid excessive animations.

---

# Accessibility

Minimum contrast ratio

```
4.5:1
```

Visible focus states required.

Do not rely on color alone to communicate information.

---

# Dark Mode

Not included in Version 1.

Design tokens should support future implementation.

---

# Token Usage Rules

- Never hardcode colors.
- Never hardcode spacing.
- Never hardcode font sizes.
- Never hardcode border radius.
- Always reference design tokens.
- Extend tokens instead of creating duplicates.

---

# Definition of Complete

The design system is complete when every visual property in MotoHub references a defined design token.
# MotoHub AI Development Guide

Version: 1.0

---

# Purpose

This document defines how AI coding assistants should contribute to the MotoHub project.

The objective is to ensure every AI-generated change follows the project's architecture, design system, and coding standards.

This guide applies to:

- OpenAI Codex
- Claude Code
- Gemini CLI
- Cursor
- Windsurf
- Cline
- Roo Code
- Any future AI coding assistant

---

# Project Goal

Build a production-ready motorcycle parts and accessories eCommerce platform.

The project prioritizes

- Performance
- Maintainability
- Scalability
- Simplicity

Never optimize for writing less code.

Always optimize for writing better code.

---

# Read Documentation First

Before making any changes, read the documentation in this order.

1. README.md

2. PRODUCT_REQUIREMENTS.md

3. FEATURES.md

4. USER_FLOW.md

5. DESIGN.md

6. COMPONENTS.md

7. CATALOG_ARCHITECTURE.md

8. COMPATIBILITY_ARCHITECTURE.md

9. ATTRIBUTE_ARCHITECTURE.md

10. PAGES.md

11. API.md

12. DATABASE.md

13. FRONTEND_IMPLEMENTATION.md

14. BACKEND_IMPLEMENTATION.md

---

# General Rules

Never invent features.

Never change architecture without updating documentation.

Never duplicate functionality.

Prefer reusable solutions.

Keep code simple.

Keep files focused.

Keep modules independent.

---

# Frontend Rules

Use

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

Never

- Use inline CSS
- Use CSS frameworks other than Tailwind
- Create duplicate components
- Hardcode colors or spacing

Always

- Use existing components
- Follow DESIGN.md
- Follow COMPONENTS.md

---

# Backend Rules

Use

- NestJS
- Prisma
- PostgreSQL

Controllers

Handle requests only.

Services

Contain business logic.

Repositories

Access the database.

Never query Prisma directly inside controllers.

---

# API Rules

All APIs must

- Follow API.md
- Validate requests
- Return consistent responses
- Handle errors gracefully
- Require authentication where appropriate

Never expose internal database structure.

---

# Database Rules

Follow DATABASE.md.

Never

- Add columns without justification
- Duplicate data
- Store business logic in the database

Prefer normalized relationships.

---

# Component Rules

Before creating a component

Check COMPONENTS.md.

If an existing component can be reused,

Reuse it.

Do not create similar components with different names.

---

# Design Rules

Follow DESIGN.md exactly.

Do not

- Invent new spacing
- Invent new typography
- Invent new colors

Reuse design tokens.

---

# Coding Standards

Use

- TypeScript Strict Mode
- ESLint
- Prettier

Avoid

- any
- Large functions
- Large components
- Deep nesting
- Duplicate code

---

# Naming

Components

PascalCase

Services

camelCase.service.ts

Hooks

useSomething.ts

Stores

something.store.ts

Types

something.types.ts

---

# Error Handling

Always

Handle

- Loading
- Empty
- Error
- Success

Never leave users with blank pages.

---

# Performance

Prefer

Lazy Loading

Code Splitting

Memoization (only when needed)

Image Optimization

Avoid premature optimization.

---

# Accessibility

Every feature should support

- Keyboard navigation
- Proper labels
- Semantic HTML
- Focus indicators

---

# Security

Never

Trust client input.

Always validate server-side.

Never expose secrets.

Never log passwords.

Always sanitize inputs.

---

# Git Workflow

One feature per branch.

One pull request per feature.

Small commits.

Meaningful commit messages.

---

# Documentation

If architecture changes,

Update the relevant documentation.

Documentation is part of the feature.

A feature is not complete until documentation is updated.

---

# When Unsure

If documentation conflicts,

Use this priority.

README

↓

PRD

↓

Architecture

↓

Design

↓

Pages

↓

API

↓

Implementation

---

# Definition of Done

Before marking work complete, verify:

- Builds successfully
- No TypeScript errors
- No lint errors
- Responsive
- Accessible
- Matches design
- Matches documentation
- No duplicated code
- Tests pass (if applicable)

---

# Philosophy

MotoHub should remain:

- Clean
- Fast
- Maintainable
- Predictable
- Easy to extend

Every change should improve the product without increasing unnecessary complexity.

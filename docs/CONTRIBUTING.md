# CONTRIBUTING.md

# MotoHub Contribution Guide

Version: 1.0

---

# Purpose

This document defines the contribution workflow for MotoHub.

It applies to all human developers and AI coding assistants.

---

# Core Principles

- Keep changes small.
- Keep changes focused.
- Maintain consistency.
- Update documentation when required.
- Never sacrifice quality for speed.

---

# Before You Start

Read the documentation in this order.

1. README.md
2. PRODUCT_REQUIREMENTS.md
3. DESIGN.md
4. COMPONENTS.md
5. PAGES.md
6. API.md
7. DATABASE.md
8. FRONTEND_IMPLEMENTATION.md
9. BACKEND_IMPLEMENTATION.md

---

# Branch Naming

Feature

```
feature/product-gallery
```

Bug Fix

```
fix/cart-calculation
```

Refactor

```
refactor/order-service
```

Documentation

```
docs/api
```

Hotfix

```
hotfix/payment-timeout
```

---

# Commit Messages

Format

```
type: description
```

Examples

```
feat: add wishlist page

fix: resolve checkout validation

refactor: simplify product service

docs: update API specification

test: add order service tests

chore: update dependencies
```

---

# Allowed Commit Types

- feat
- fix
- refactor
- docs
- test
- style
- chore
- perf
- build
- ci

---

# Pull Requests

Every Pull Request should focus on one feature or one bug.

Do not combine unrelated changes.

---

# Pull Request Checklist

Before creating a PR

- Code builds successfully
- Lint passes
- Tests pass
- Documentation updated
- No merge conflicts
- Feature manually tested

---

# Code Review Checklist

Reviewers should verify

- Correctness
- Readability
- Maintainability
- Performance
- Security
- Accessibility
- Responsiveness
- Documentation

---

# Documentation Rules

Documentation must be updated when changing

- API
- Database
- Folder Structure
- Architecture
- UI
- Features
- Business Logic

Code is not complete until documentation is updated.

---

# Testing Requirements

Minimum

- Feature tested manually

Recommended

- Unit Tests
- Integration Tests
- E2E Tests (where applicable)

---

# UI Changes

Every UI contribution must

- Follow DESIGN.md
- Reuse existing components
- Support mobile
- Support keyboard navigation
- Include loading state
- Include empty state
- Include error state

---

# Backend Changes

Every backend contribution must

- Validate requests
- Handle errors
- Use services
- Use repositories
- Follow API specification
- Update Swagger

---

# Database Changes

Every schema change requires

- Prisma migration
- Migration review
- Documentation update
- Seed update (if needed)

Never modify production data manually.

---

# Dependencies

Before adding a dependency

Verify

- Existing solution cannot solve the problem.
- Package is actively maintained.
- Package has a permissive license.
- Package size is reasonable.

Remove unused dependencies.

---

# Security

Never commit

- Passwords
- API Keys
- Tokens
- Secrets
- Certificates
- Private Keys
- .env files

Use `.env.example` for required variables.

---

# Coding Standards

Follow

- CODING_STANDARDS.md
- FRONTEND_IMPLEMENTATION.md
- BACKEND_IMPLEMENTATION.md

---

# Merge Requirements

A branch may be merged only if

- Code Review Approved
- CI Passing
- Tests Passing
- Documentation Updated

---

# Versioning

Use Semantic Versioning.

Examples

```
1.0.0

1.0.1

1.1.0

2.0.0
```

---

# Release Process

Development

↓

Testing

↓

Review

↓

Merge

↓

Deployment

---

# Issue Reporting

Every issue should include

- Title
- Description
- Expected Behavior
- Actual Behavior
- Steps to Reproduce
- Screenshots (if applicable)
- Environment
- Browser
- Device

---

# Feature Requests

Feature requests should include

- Problem
- Proposed Solution
- Expected Benefit
- Possible Alternatives

---

# Bug Reports

Include

- Error Message
- Logs
- Screenshots
- Reproduction Steps
- Severity

---

# AI Contributions

AI-generated code must

- Follow project documentation
- Compile successfully
- Pass linting
- Be reviewed before merging
- Not introduce undocumented features

---

# Definition of Complete Contribution

A contribution is complete when

- Code implemented
- Tests passing
- Documentation updated
- Reviewed
- Approved
- Ready for deployment
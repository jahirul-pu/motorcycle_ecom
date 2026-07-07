# PHASE_02_AUTHENTICATION.md

Version: 1.0

Estimated Duration: 5–7 Days

Status: Not Started

Priority: Critical

Depends On

- Phase 01 Foundation

---

# Objective

Implement the complete authentication and customer account system.

By the end of this phase, customers should be able to

- Register
- Login
- Logout
- Reset Password
- Update Profile
- Change Password
- Manage Addresses

No shopping features are implemented yet.

---

# Deliverables

✓ Customer Authentication

✓ JWT Authentication

✓ Refresh Tokens

✓ Protected Routes

✓ Customer Profile

✓ Address Book

✓ Forgot Password

✓ Reset Password

✓ Email Verification Infrastructure

---

# Success Criteria

A customer can

- Create an account
- Login
- Stay logged in
- Logout
- Recover password
- Update profile
- Manage addresses

---

# Milestone 1

Authentication Module

Status

⬜

---

Backend

Create

```
Auth Module

Auth Controller

Auth Service

JWT Strategy

Refresh Strategy

Password Service

Email Service
```

---

Deliverable

Authentication infrastructure complete.

---

# Milestone 2

User Module

Status

⬜

---

Database

Create

```
users

refresh_tokens
```

---

Backend

Create

```
User Entity

Repository

DTOs

Validation

Mapper
```

---

Deliverable

User management complete.

---

# Milestone 3

Registration

Status

⬜

---

Backend

Create

```
POST /auth/register
```

Requirements

- Email validation
- Phone validation
- Password hashing
- Duplicate checking

---

Frontend

Create

```
Register Page

Register Form

Validation

Success Screen
```

---

Deliverable

Customer registration complete.

---

# Milestone 4

Login

Status

⬜

---

Backend

```
POST /auth/login
```

Generate

Access Token

Refresh Token

---

Frontend

Create

```
Login Page

Login Form

Remember Me

Loading State

Error State
```

---

Deliverable

Customer login complete.

---

# Milestone 5

Refresh Tokens

Status

⬜

---

Implement

```
POST /auth/refresh
```

Requirements

- Rotation
- Expiration
- Revocation

---

Deliverable

Persistent login.

---

# Milestone 6

Logout

Status

⬜

---

Backend

```
POST /auth/logout
```

Invalidate refresh token.

---

Frontend

Logout

Redirect

Clear session

---

Deliverable

Secure logout.

---

# Milestone 7

Forgot Password

Status

⬜

---

Backend

```
POST /auth/forgot-password
```

Generate reset token.

Send email.

---

Frontend

Forgot Password Page.

---

Deliverable

Password reset request.

---

# Milestone 8

Reset Password

Status

⬜

---

Backend

```
POST /auth/reset-password
```

Requirements

- Verify token
- Expiration
- Update password

---

Frontend

Reset Password Form

---

Deliverable

Password recovery complete.

---

# Milestone 9

Customer Profile

Status

⬜

---

Backend

```
GET /me

PATCH /me
```

---

Frontend

Profile Page

Edit Profile

Avatar Placeholder

---

Deliverable

Customer profile management.

---

# Milestone 10

Address Book

Status

⬜

---

Database

```
addresses
```

---

Backend

CRUD

---

Frontend

Address List

Add Address

Edit Address

Delete Address

Default Address

---

Deliverable

Address management complete.

---

# Milestone 11

Protected Routes

Status

⬜

---

Frontend

Protect

```
Account

Orders

Wishlist

Checkout
```

---

Backend

JWT Guards

Role Guards

---

Deliverable

Private routes protected.

---

# Milestone 12

Email Verification Infrastructure

Status

⬜

---

Implement

Verification Token

Verification Email

Verification Endpoint

Resend Verification

Frontend Notice

---

Deliverable

Email verification ready.

---

# Milestone 13

Validation

Status

⬜

---

Validate

Email

Phone

Password

Names

Addresses

---

Deliverable

Robust validation.

---

# Milestone 14

Security

Status

⬜

---

Implement

Rate Limiting

Password Hashing

JWT

Refresh Rotation

Secure Cookies (if applicable)

CORS

Helmet

---

Deliverable

Authentication secure.

---

# API Endpoints

```
POST /auth/register

POST /auth/login

POST /auth/logout

POST /auth/refresh

POST /auth/forgot-password

POST /auth/reset-password

POST /auth/verify-email

POST /auth/resend-verification

GET /me

PATCH /me
```

---

# Database Tables

```
users

refresh_tokens

addresses
```

---

# Frontend Pages

```
/login

/register

/forgot-password

/reset-password

/account/profile

/account/addresses
```

---

# Components

```
LoginForm

RegisterForm

ForgotPasswordForm

ResetPasswordForm

ProfileForm

AddressCard

AddressForm

ProtectedRoute
```

---

# Forbidden During Phase 2

Do NOT build

Products

Categories

Brands

Cart

Wishlist

Orders

Checkout

Reviews

Payments

Search

Admin

Dashboard

---

# Testing

Verify

- Registration
- Login
- Logout
- Token Refresh
- Password Reset
- Address CRUD
- Protected Routes
- Invalid Credentials
- Expired Tokens

---

# Phase Exit Checklist

User Module

Authentication Module

JWT

Refresh Tokens

Registration

Login

Logout

Forgot Password

Reset Password

Profile

Address Book

Protected Routes

Validation

Tests Passing

Documentation Updated

---

# Definition of Done

Phase 2 is complete when a customer can securely create an account, authenticate, manage their profile and addresses, recover their password, and access protected areas of MotoHub without implementing any shopping functionality.
# ENV_VARIABLES.md

# MotoHub Environment Variables Reference

Version: 1.0

---

# Purpose

This document defines every environment variable used by MotoHub.

Never hardcode configuration values.

---

# File Priority

Development

```
.env.local
```

↓

```
.env
```

Production

```
.env.production
```

---

# Application

| Variable | Required | Description              |
| -------- | -------- | ------------------------ |
| NODE_ENV | Yes      | development / production |
| PORT     | Yes      | API server port          |
| APP_NAME | Yes      | Application name         |
| APP_URL  | Yes      | Public application URL   |
| API_URL  | Yes      | Backend API URL          |

---

# Frontend

| Variable             | Required | Description      |
| -------------------- | -------- | ---------------- |
| NEXT_PUBLIC_SITE_URL | Yes      | Website URL      |
| NEXT_PUBLIC_API_URL  | Yes      | Backend API      |
| NEXT_PUBLIC_APP_NAME | Yes      | Application name |

---

# Database

| Variable           | Required | Description                  |
| ------------------ | -------- | ---------------------------- |
| DATABASE_URL       | Yes      | PostgreSQL connection string |
| DATABASE_POOL_SIZE | No       | Connection pool size         |

---

# Redis

| Variable  | Required | Description             |
| --------- | -------- | ----------------------- |
| REDIS_URL | Yes      | Redis connection string |

---

# Authentication

| Variable               | Required | Description            |
| ---------------------- | -------- | ---------------------- |
| JWT_SECRET             | Yes      | Access token secret    |
| JWT_REFRESH_SECRET     | Yes      | Refresh token secret   |
| JWT_EXPIRES_IN         | Yes      | Access token lifetime  |
| JWT_REFRESH_EXPIRES_IN | Yes      | Refresh token lifetime |

---

# Email

| Variable       | Required | Description    |
| -------------- | -------- | -------------- |
| RESEND_API_KEY | Yes      | Resend API Key |
| MAIL_FROM      | Yes      | Sender email   |
| MAIL_NAME      | Yes      | Sender name    |

---

# Object Storage

| Variable      | Required | Description      |
| ------------- | -------- | ---------------- |
| S3_ENDPOINT   | Yes      | Storage endpoint |
| S3_REGION     | Yes      | Region           |
| S3_BUCKET     | Yes      | Bucket name      |
| S3_ACCESS_KEY | Yes      | Access key       |
| S3_SECRET_KEY | Yes      | Secret key       |

---

# SSLCommerz

| Variable                  | Required | Description    |
| ------------------------- | -------- | -------------- |
| SSLCOMMERZ_STORE_ID       | Yes      | Store ID       |
| SSLCOMMERZ_STORE_PASSWORD | Yes      | Store Password |
| SSLCOMMERZ_SANDBOX        | Yes      | Sandbox Mode   |

---

# bKash

| Variable         | Required | Description  |
| ---------------- | -------- | ------------ |
| BKASH_APP_KEY    | Yes      | App Key      |
| BKASH_APP_SECRET | Yes      | App Secret   |
| BKASH_USERNAME   | Yes      | Username     |
| BKASH_PASSWORD   | Yes      | Password     |
| BKASH_SANDBOX    | Yes      | Sandbox Mode |

---

# Nagad

| Variable          | Required | Description |
| ----------------- | -------- | ----------- |
| NAGAD_MERCHANT_ID | Future   | Merchant ID |
| NAGAD_PUBLIC_KEY  | Future   | Public Key  |
| NAGAD_PRIVATE_KEY | Future   | Private Key |

---

# Rocket

| Variable       | Required | Description |
| -------------- | -------- | ----------- |
| ROCKET_API_KEY | Future   | API Key     |

---

# Analytics

| Variable            | Required | Description      |
| ------------------- | -------- | ---------------- |
| GOOGLE_ANALYTICS_ID | Optional | Google Analytics |
| FACEBOOK_PIXEL_ID   | Optional | Meta Pixel       |

---

# Security

| Variable          | Required | Description     |
| ----------------- | -------- | --------------- |
| CORS_ORIGIN       | Yes      | Allowed origins |
| RATE_LIMIT_MAX    | Yes      | Max requests    |
| RATE_LIMIT_WINDOW | Yes      | Time window     |

---

# Logging

| Variable   | Required | Description |
| ---------- | -------- | ----------- |
| LOG_LEVEL  | Yes      | Log level   |
| LOG_PRETTY | No       | Pretty logs |

---

# Feature Flags

| Variable            | Required | Description           |
| ------------------- | -------- | --------------------- |
| ENABLE_REGISTRATION | Optional | Customer registration |
| ENABLE_REVIEWS      | Optional | Product reviews       |
| ENABLE_COUPONS      | Optional | Coupon system         |

---

# Development

| Variable        | Required | Description   |
| --------------- | -------- | ------------- |
| SWAGGER_ENABLED | No       | Swagger UI    |
| PRISMA_STUDIO   | No       | Prisma Studio |

---

# Rules

- Never commit `.env`
- Commit only `.env.example`
- Keep production secrets outside Git
- Rotate secrets regularly
- Document every new variable here

---

# Definition of Complete

Every environment variable used anywhere in MotoHub must be documented in this file.

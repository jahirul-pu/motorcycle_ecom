# ERROR_CODES.md

# MotoHub Error Codes

Version: 1.0

---

# Purpose

This document defines the standard error codes used across MotoHub.

Every API should return a consistent error code and message.

---

# Error Response Format

```json
{
  "success": false,
  "code": "AUTH_001",
  "message": "Invalid email or password."
}
```

---

# HTTP Status Codes

| HTTP | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 429  | Too Many Requests     |
| 500  | Internal Server Error |

---

# Authentication Errors

| Code     | Message                      |
| -------- | ---------------------------- |
| AUTH_001 | Invalid email or password    |
| AUTH_002 | Authentication required      |
| AUTH_003 | Invalid access token         |
| AUTH_004 | Access token expired         |
| AUTH_005 | Invalid refresh token        |
| AUTH_006 | Refresh token expired        |
| AUTH_007 | Account disabled             |
| AUTH_008 | Email not verified           |
| AUTH_009 | Password reset token invalid |
| AUTH_010 | Password reset token expired |

---

# Authorization Errors

| Code     | Message                       |
| -------- | ----------------------------- |
| PERM_001 | Permission denied             |
| PERM_002 | Administrator access required |
| PERM_003 | Resource access denied        |
| PERM_004 | Role not authorized           |

---

# Validation Errors

| Code      | Message                 |
| --------- | ----------------------- |
| VALID_001 | Validation failed       |
| VALID_002 | Required field missing  |
| VALID_003 | Invalid input format    |
| VALID_004 | Invalid email address   |
| VALID_005 | Invalid phone number    |
| VALID_006 | Invalid file type       |
| VALID_007 | File size exceeds limit |
| VALID_008 | Invalid request body    |

---

# Product Errors

| Code     | Message                |
| -------- | ---------------------- |
| PROD_001 | Product not found      |
| PROD_002 | Product unavailable    |
| PROD_003 | Product archived       |
| PROD_004 | Product out of stock   |
| PROD_005 | Invalid product slug   |
| PROD_006 | Product already exists |

---

# Category Errors

| Code    | Message            |
| ------- | ------------------ |
| CAT_001 | Category not found |
| CAT_002 | Category archived  |
| CAT_003 | Invalid category   |

---

# Brand Errors

| Code      | Message         |
| --------- | --------------- |
| BRAND_001 | Brand not found |
| BRAND_002 | Brand archived  |

---

# Cart Errors

| Code     | Message                        |
| -------- | ------------------------------ |
| CART_001 | Cart not found                 |
| CART_002 | Cart is empty                  |
| CART_003 | Product already in cart        |
| CART_004 | Invalid quantity               |
| CART_005 | Requested quantity unavailable |

---

# Checkout Errors

| Code         | Message                     |
| ------------ | --------------------------- |
| CHECKOUT_001 | Checkout failed             |
| CHECKOUT_002 | Shipping address required   |
| CHECKOUT_003 | Shipping method unavailable |
| CHECKOUT_004 | Payment method unavailable  |
| CHECKOUT_005 | Order could not be created  |

---

# Order Errors

| Code      | Message                   |
| --------- | ------------------------- |
| ORDER_001 | Order not found           |
| ORDER_002 | Order already cancelled   |
| ORDER_003 | Order cannot be cancelled |
| ORDER_004 | Invalid order status      |
| ORDER_005 | Order already completed   |

---

# Payment Errors

| Code    | Message                     |
| ------- | --------------------------- |
| PAY_001 | Payment failed              |
| PAY_002 | Payment cancelled           |
| PAY_003 | Payment timeout             |
| PAY_004 | Payment verification failed |
| PAY_005 | Duplicate payment           |
| PAY_006 | Unsupported payment method  |

---

# Coupon Errors

| Code       | Message                      |
| ---------- | ---------------------------- |
| COUPON_001 | Coupon not found             |
| COUPON_002 | Coupon expired               |
| COUPON_003 | Coupon inactive              |
| COUPON_004 | Coupon usage limit reached   |
| COUPON_005 | Coupon not applicable        |
| COUPON_006 | Minimum order amount not met |

---

# Review Errors

| Code       | Message                            |
| ---------- | ---------------------------------- |
| REVIEW_001 | Review not found                   |
| REVIEW_002 | Review already submitted           |
| REVIEW_003 | Purchase required before reviewing |

---

# Search Errors

| Code       | Message                    |
| ---------- | -------------------------- |
| SEARCH_001 | Search query required      |
| SEARCH_002 | Search service unavailable |

---

# Upload Errors

| Code     | Message                 |
| -------- | ----------------------- |
| FILE_001 | Upload failed           |
| FILE_002 | Unsupported file type   |
| FILE_003 | File too large          |
| FILE_004 | Corrupted file          |
| FILE_005 | Image processing failed |

---

# Inventory Errors

| Code    | Message                      |
| ------- | ---------------------------- |
| INV_001 | Insufficient stock           |
| INV_002 | Inventory unavailable        |
| INV_003 | Inventory reservation failed |

---

# Database Errors

| Code   | Message                     |
| ------ | --------------------------- |
| DB_001 | Database connection failed  |
| DB_002 | Record not found            |
| DB_003 | Duplicate record            |
| DB_004 | Database transaction failed |

---

# Server Errors

| Code    | Message               |
| ------- | --------------------- |
| SYS_001 | Internal server error |
| SYS_002 | Service unavailable   |
| SYS_003 | Configuration error   |
| SYS_004 | Unexpected error      |

---

# Rate Limiting

| Code     | Message           |
| -------- | ----------------- |
| RATE_001 | Too many requests |

---

# Maintenance

| Code      | Message                  |
| --------- | ------------------------ |
| MAINT_001 | System under maintenance |

---

# Logging Rules

Internal logs should contain

- Error Code
- Timestamp
- Request ID
- User ID (if authenticated)
- Endpoint
- Stack Trace (server only)

Client responses must never include

- Stack traces
- SQL errors
- Internal file paths
- Sensitive information

---

# Error Code Rules

- Codes are permanent once published.
- Do not reuse retired codes.
- Add new codes instead of changing existing ones.
- Every new module should have its own prefix.

---

# Module Prefixes

| Prefix   | Module         |
| -------- | -------------- |
| AUTH     | Authentication |
| PERM     | Authorization  |
| VALID    | Validation     |
| PROD     | Products       |
| CAT      | Categories     |
| BRAND    | Brands         |
| CART     | Cart           |
| CHECKOUT | Checkout       |
| ORDER    | Orders         |
| PAY      | Payments       |
| COUPON   | Coupons        |
| REVIEW   | Reviews        |
| SEARCH   | Search         |
| FILE     | Uploads        |
| INV      | Inventory      |
| DB       | Database       |
| SYS      | System         |
| RATE     | Rate Limiting  |
| MAINT    | Maintenance    |

---

# Definition of Complete

Every API error returned by MotoHub must:

- Use a standardized error code
- Return the correct HTTP status
- Provide a user-friendly message
- Be documented in this file

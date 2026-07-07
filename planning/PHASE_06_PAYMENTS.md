# PHASE_06_PAYMENTS.md

Version: 1.0

Estimated Duration: 7–10 Days

Status: Not Started

Priority: Critical

Depends On

- Phase 01 Foundation
- Phase 02 Authentication
- Phase 03 Catalog
- Phase 04 Search
- Phase 05 Shopping

---

# Objective

Implement secure payment processing for MotoHub.

Version 1 supports only payment methods commonly used in Bangladesh.

---

# Supported Payment Methods

Online

- SSLCommerz
- bKash
- Nagad
- Rocket

Offline

- Cash on Delivery

---

# Deliverables

✓ Payment Infrastructure

✓ SSLCommerz Integration

✓ bKash Integration

✓ COD

✓ Payment Verification

✓ Callback Handling

✓ Refund Foundation

✓ Payment History

---

# Success Criteria

A customer can complete an order using any supported payment method and the payment status is accurately reflected in the order.

---

# Milestone 1

Payment Architecture

Status

⬜

---

Create

```
Payment Module

Payment Service

Gateway Interface

Payment Repository
```

Implement a provider-based architecture so each payment gateway can be maintained independently.

---

Deliverable

Payment architecture complete.

---

# Milestone 2

Cash on Delivery

Status

⬜

---

Implement

```
COD Selection

Order Creation

Pending Payment Status

Confirmation
```

---

Deliverable

Cash on Delivery operational.

---

# Milestone 3

SSLCommerz

Status

⬜

---

Implement

```
Session Creation

Gateway Redirect

Success Callback

Failure Callback

Cancel Callback

IPN Validation
```

---

Deliverable

SSLCommerz integration complete.

---

# Milestone 4

bKash

Status

⬜

---

Implement

```
Token Generation

Payment Creation

Payment Execution

Status Verification

Error Handling
```

---

Deliverable

bKash integration complete.

---

# Milestone 5

Nagad

Status

⬜

---

Implement

```
Payment Request

Callback

Verification

Status Check
```

---

Deliverable

Nagad integration complete.

---

# Milestone 6

Rocket

Status

⬜

---

Implement according to available merchant integration.

If API integration is unavailable, design the architecture so it can be added later without changing the checkout flow.

---

Deliverable

Rocket integration or placeholder complete.

---

# Milestone 7

Payment Verification

Status

⬜

---

Implement

```
Server-side verification

Duplicate callback protection

Signature verification

Payment reconciliation
```

Never trust client-side payment success.

---

Deliverable

Secure payment verification.

---

# Milestone 8

Order Synchronization

Status

⬜

---

Update

```
Payment Status

Order Status

Inventory

Transaction Records
```

Use database transactions.

---

Deliverable

Order synchronization complete.

---

# Milestone 9

Payment History

Status

⬜

---

Customer

```
Payment Status

Payment Method

Transaction Reference

Paid Date
```

Admin

```
Payment Dashboard

Payment Search

Payment Filters
```

---

Deliverable

Payment history complete.

---

# Milestone 10

Failure Recovery

Status

⬜

---

Handle

```
Cancelled Payment

Failed Payment

Timeout

Duplicate Request

Network Failure

Unknown Status
```

Customer should always receive a clear outcome.

---

Deliverable

Reliable failure handling.

---

# API Endpoints

```
POST /payments/create

POST /payments/verify

POST /payments/callback

GET /payments/:id

GET /orders/:id/payment
```

---

# Database

Use existing

```
payments

orders
```

Add fields if required

```
gateway_reference

provider_reference

verification_status

verified_at
```

---

# Frontend Pages

```
/checkout/payment

/payment/success

/payment/failure

/payment/cancelled
```

---

# Components

```
PaymentSelector

PaymentSummary

PaymentStatus

GatewayRedirect

PaymentSuccess

PaymentFailure
```

---

# Business Rules

- Never mark an order as paid before server verification.
- Never trust browser callbacks.
- Every transaction must be logged.
- Every payment must have an audit trail.
- Inventory remains reserved until payment outcome is known.

---

# Security

Implement

- Callback verification
- Signature validation
- Idempotency
- Duplicate transaction detection
- Rate limiting
- Secure logging

---

# Testing

Verify

- COD
- SSLCommerz
- bKash
- Nagad
- Rocket (if available)
- Failed payments
- Cancelled payments
- Duplicate callbacks
- Timeout recovery
- Inventory synchronization

---

# Forbidden During Phase 6

Do NOT build

Analytics

Subscriptions

Wallet

Store Credit

Installments

Reward Points

Recurring Billing

International Payments

---

# Phase Exit Checklist

Payment Module

COD

SSLCommerz

bKash

Nagad

Rocket

Verification

Callbacks

Payment History

Failure Recovery

Tests Passing

Documentation Updated

---

# Definition of Done

Phase 6 is complete when customers can securely pay using all supported Bangladesh payment methods, payments are verified server-side, orders are updated correctly, and every transaction is safely recorded.

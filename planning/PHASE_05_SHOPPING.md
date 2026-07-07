# PHASE_05_SHOPPING.md

Version: 1.0

Estimated Duration: 10–14 Days

Status: Not Started

Priority: Critical

Depends On

- Phase 01 Foundation
- Phase 02 Authentication
- Phase 03 Catalog
- Phase 04 Search

---

# Objective

Implement the complete shopping experience.

By the end of this phase, customers should be able to

- Save products to Wishlist
- Add products to Cart
- Manage Cart
- Checkout
- Apply Coupons
- Select Shipping Address
- Select Payment Method
- Place Orders

---

# Deliverables

✓ Wishlist

✓ Shopping Cart

✓ Coupon System

✓ Bangladesh Checkout

✓ Address Selection

✓ Shipping Selection

✓ Order Placement

✓ Order Confirmation

---

# Success Criteria

A customer can browse products, add them to the cart, complete checkout, and successfully create an order.

---

# Milestone 1

Wishlist

Status

⬜

---

Database

```
wishlists
```

---

Backend

```
Wishlist Module

Wishlist CRUD

Wishlist Validation
```

---

Frontend

```
Wishlist Page

Wishlist Button

Wishlist Counter

Move to Cart
```

---

API

```
GET /wishlist

POST /wishlist

DELETE /wishlist/:productId
```

---

Deliverable

Wishlist complete.

---

# Milestone 2

Shopping Cart

Status

⬜

---

Database

```
carts

cart_items
```

---

Backend

Implement

```
Create Cart

Guest Cart

Customer Cart

Merge Guest Cart

Quantity Update

Remove Item

Clear Cart
```

---

Frontend

```
Mini Cart

Cart Drawer

Cart Page

Cart Summary
```

---

Deliverable

Shopping cart complete.

---

# Milestone 3

Coupon System

Status

⬜

---

Database

```
coupons

coupon_usages
```

---

Backend

Implement

```
Apply Coupon

Remove Coupon

Validation

Usage Tracking
```

---

Frontend

```
Coupon Input

Coupon Status

Discount Summary
```

---

Deliverable

Coupon system complete.

---

# Milestone 4

Checkout

Status

⬜

---

Frontend

Sections

```
Customer Information

Shipping Address

Billing Address

Shipping Method

Payment Method

Order Summary
```

---

Checkout must be

- Single Page
- Mobile First
- Minimal Steps

---

Deliverable

Checkout page complete.

---

# Milestone 5

Bangladesh Checkout

Status

⬜

---

Shipping

```
Inside Dhaka

Outside Dhaka
```

---

Phone

Bangladesh format validation.

---

Address Fields

```
Recipient Name

Phone

Division

District

Area

Address Line

Postal Code (Optional)

Delivery Notes
```

---

Deliverable

Bangladesh checkout complete.

---

# Milestone 6

Order Creation

Status

⬜

---

Backend

Create

```
orders

order_items

payments
```

---

Implement

```
Inventory Reservation

Order Number Generation

Order Snapshot

Transaction Handling
```

---

Deliverable

Order creation complete.

---

# Milestone 7

Order Confirmation

Status

⬜

---

Frontend

Display

```
Order Number

Items

Payment Method

Delivery Address

Estimated Delivery

Continue Shopping
```

---

Deliverable

Confirmation page complete.

---

# Milestone 8

Customer Orders

Status

⬜

---

Frontend

```
Order List

Order Details

Order Timeline

Invoice Download (Future)
```

---

Backend

```
GET /orders

GET /orders/:id
```

---

Deliverable

Customer order history complete.

---

# Milestone 9

Inventory Reservation

Status

⬜

---

Backend

Implement

```
Reserve Inventory

Release Inventory

Deduct Inventory

Prevent Overselling
```

---

Deliverable

Inventory protection complete.

---

# Milestone 10

Notifications

Status

⬜

---

Customer

Receive

```
Order Confirmation Email

Order Placed Notification
```

---

Deliverable

Order notifications complete.

---

# API Endpoints

```
GET /cart

POST /cart/items

PATCH /cart/items/:id

DELETE /cart/items/:id

DELETE /cart

GET /wishlist

POST /wishlist

DELETE /wishlist/:productId

POST /checkout

GET /orders

GET /orders/:id

POST /coupons/apply

DELETE /coupons/remove
```

---

# Frontend Pages

```
/wishlist

/cart

/checkout

/order-success

/account/orders

/account/orders/:id
```

---

# Components

```
WishlistButton

WishlistCard

MiniCart

CartDrawer

CartItem

CartSummary

CouponInput

CheckoutForm

ShippingSelector

PaymentSelector

OrderSummary

OrderConfirmation
```

---

# Business Rules

Guest checkout

❌ Not Supported (Version 1)

Customer account required.

---

Cart

Supports

- Quantity Updates
- Coupon
- Inventory Validation

---

Order

Stores

- Product Snapshot
- Price Snapshot
- Address Snapshot

Orders never change after creation.

---

# Forbidden During Phase 5

Do NOT build

Admin Order Management

Payment Gateway Integration

Product Reviews

Search Improvements

CMS

Analytics

---

# Testing

Verify

- Wishlist CRUD
- Cart CRUD
- Guest Cart Merge
- Coupon Validation
- Checkout Validation
- Order Creation
- Inventory Reservation
- Order Confirmation
- Customer Order History

---

# Phase Exit Checklist

Wishlist

Shopping Cart

Coupons

Checkout

Address Selection

Order Creation

Inventory Reservation

Customer Orders

Notifications

Responsive UI

Tests Passing

Documentation Updated

---

# Definition of Done

Phase 5 is complete when a registered customer can add products to a wishlist, manage a shopping cart, complete a Bangladesh-optimized checkout, place an order, and view their order history with accurate inventory handling.

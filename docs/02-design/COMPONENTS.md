# COMPONENTS.md

# MotoHub Component Library

Version: 1.0

---

# Purpose

This document defines every reusable UI component used throughout MotoHub.

Components are the building blocks of the application.

Every screen should be composed from these components rather than creating custom UI.

If a component already exists, it must be reused.

If a component needs modification, create a variant instead of duplicating it.

---

# Component Standards

Every component must define:

Purpose

Variants

Properties (Props)

States

Accessibility

Responsive Behavior

Dependencies

Usage Rules

Future Improvements (optional)

---

# Naming Convention

PascalCase

Examples

Button

ProductCard

CategoryCard

ProductGallery

PriceDisplay

ReviewCard

CartDrawer

AddressForm

CheckoutStepper

---

# Component Categories

## 1. Layout

AppShell

Container

Section

Grid

Stack

Divider

Spacer

Sidebar

ContentArea

StickyContainer

PageHeader

PageFooter

SectionHeader

HeroSection

BannerSection

---

## 2. Navigation

AnnouncementBar

Navbar

DesktopNavigation

MobileNavigation

MegaMenu

CategoryMenu

Breadcrumb

Pagination

Tabs

Drawer

SearchOverlay

SearchSuggestions

SearchHistory

ProfileDropdown

WishlistIcon

CartIcon

BackButton

---

## 3. Buttons

PrimaryButton

SecondaryButton

GhostButton

OutlineButton

DangerButton

IconButton

FloatingButton

LinkButton

LoadingButton

QuantityButton

---

### Button Properties

Variant

Size

Disabled

Loading

Icon

Full Width

Rounded

---

### Button Sizes

Small

Medium

Large

---

### Button States

Default

Hover

Pressed

Focused

Disabled

Loading

---

### Accessibility

Keyboard accessible

Focus ring required

Minimum height 44px

---

## 4. Forms

TextInput

PhoneInput

EmailInput

PasswordInput

Textarea

Checkbox

Radio

Switch

Select

MultiSelect

SearchInput

NumberInput

CouponInput

OTPInput

---

### Every Input Includes

Label

Placeholder

Helper Text

Required Indicator

Validation

Error Message

Disabled State

Character Limit (when applicable)

---

## 5. Cards

ProductCard

BrandCard

CategoryCard

ReviewCard

OrderCard

CouponCard

AddressCard

InfoCard

StatisticCard

PromotionCard

CMSCard

---

## Product Card

### Purpose

Display products consistently across the platform.

---

### Layout

Product Image

↓

Brand

↓

Product Name

↓

Price

↓

Stock Status

↓

Actions

---

### Actions

Wishlist

Quick Add to Cart

Quick View (future)

---

### Properties

Product

Badge

Stock

Rating

Sale

---

### Variants

Default

Compact

Horizontal

Featured

---

### States

Default

Hover

Loading

Out of Stock

Sale

New

---

### Rules

Product name limited to two lines.

Price always visible.

Image always square.

---

## 6. Product Components

ProductGallery

ImageZoom

ImageThumbnail

ProductInfo

PriceDisplay

StockIndicator

QuantitySelector

AddToCartSection

BuyNowButton

CompatibilityTable

SpecificationsTable

ProductDescription

ProductTabs

RelatedProducts

RecentlyViewed

ShareButtons

ProductBadges

WarrantyInfo

SKUDisplay

---

### Product Gallery

Supports

Multiple Images

Zoom

Swipe

Keyboard Navigation

Thumbnail Navigation

Fullscreen

Lazy Loading

---

## 7. Search Components

SearchBar

SearchOverlay

SearchSuggestions

PopularSearches

RecentSearches

SearchResultCard

EmptySearch

SearchFilters

---

## 8. Filter Components

FilterSidebar

FilterDrawer

PriceSlider

CheckboxFilter

BrandFilter

CategoryFilter

AvailabilityFilter

CompatibilityFilter

ActiveFilters

ClearFiltersButton

SortDropdown

---

### Filter Rules

Desktop

Sidebar

---

Mobile

Bottom Drawer

---

Filters update URL.

---

## 9. Cart Components

MiniCart

CartDrawer

CartPage

CartItem

QuantityControl

CouponForm

OrderSummary

ShippingEstimator

EmptyCart

---

## Cart Item

Displays

Image

Name

Brand

Price

Quantity

Remove

Subtotal

---

## 10. Checkout Components

CheckoutStepper

ContactForm

AddressForm

ShippingMethodSelector

PaymentMethodSelector

OrderSummary

CouponSection

TermsCheckbox

PlaceOrderButton

OrderSuccessCard

---

### Checkout Stepper

Desktop

Horizontal

---

Mobile

Vertical

---

### Payment Methods

Cash on Delivery

bKash

Nagad

Rocket

SSLCommerz

Each method must support

Icon

Description

Selection State

Disabled State

---

## 11. Customer Components

AccountSidebar

ProfileForm

OrderTable

OrderTimeline

WishlistGrid

SavedAddressCard

PasswordForm

Avatar

---

## 12. Review Components

ReviewSummary

ReviewCard

RatingStars

WriteReviewForm

RatingBreakdown

EmptyReviews

---

### Rating

Supports

1-5 Stars

Half Stars (optional future)

---

## 13. CMS Components

ArticleCard

PageHeader

FAQAccordion

ContactForm

NewsletterSignup

PolicyContent

---

## 14. Feedback Components

Toast

Snackbar

Alert

ConfirmationDialog

Modal

Drawer

Tooltip

Popover

LoadingOverlay

---

### Toast Types

Success

Error

Warning

Information

---

## 15. Empty States

EmptyCart

EmptyWishlist

EmptyOrders

EmptySearch

EmptyCategory

EmptyReviews

---

Each contains

Illustration

Title

Description

Primary Action

---

## 16. Loading Components

SkeletonCard

SkeletonProduct

SkeletonCategory

SkeletonReview

SkeletonOrder

SkeletonBanner

SkeletonTable

SkeletonText

---

Loading should resemble the final layout.

---

## 17. Tables

ProductTable

OrderTable

CustomerTable

InventoryTable

CouponTable

BrandTable

CategoryTable

ReviewTable

---

### Table Features

Sorting

Filtering

Pagination

Column Visibility

Responsive

Bulk Actions

---

## 18. Badges

SaleBadge

NewBadge

StockBadge

BestSellerBadge

LimitedBadge

OutOfStockBadge

---

Maximum two badges per product.

---

## 19. Tags

CategoryTag

BrandTag

StatusTag

CouponTag

InventoryTag

---

## 20. Pricing Components

PriceDisplay

DiscountBadge

SavingsLabel

InstallmentLabel (Future)

---

### Price Rules

Current price always largest.

Old price struck through.

Savings shown only when discounted.

---

## 21. Status Indicators

In Stock

Out of Stock

Low Stock

Coming Soon

Discontinued

---

Never communicate stock using color alone.

Always include text.

---

## 22. Images

ResponsiveImage

LazyImage

GalleryImage

Thumbnail

BrandLogo

CategoryImage

BannerImage

AvatarImage

---

Support

WebP

AVIF

Fallback JPG

---

## 23. Icons

Cart

Wishlist

Search

Profile

Arrow

Chevron

Share

Filter

Sort

Heart

Truck

Location

Payment

Security

---

Icons should come from one icon library only.

---

## 24. Admin Components

DashboardCard

MetricCard

RecentOrders

SalesChart

InventoryAlert

AdminSidebar

AdminHeader

DataTable

BulkActions

MediaUploader

ProductEditor

RichTextEditor

ImageUploader

TagSelector

AttributeEditor

VariantEditor (future)

SEOEditor

StatusSelector

---

## 25. Error Components

404State

500State

MaintenanceState

PermissionDenied

NetworkError

RetryCard

---

## 26. Accessibility Standards

Every component must

Support keyboard navigation

Display visible focus indicators

Use semantic HTML

Provide ARIA labels when needed

Meet WCAG AA contrast ratios

Be usable without a mouse

---

## 27. Responsive Rules

Desktop

Full Layout

---

Tablet

Reduced spacing

Collapsible filters

---

Mobile

Single-column layout

Bottom drawers

Large touch targets

Sticky purchase actions

---

## 28. Component Development Rules

A component should have one clear responsibility.

Avoid combining unrelated functionality.

Favor composition over large, monolithic components.

Business logic should remain outside presentational components where practical.

All components should be typed with TypeScript interfaces.

Visual styling should come from shared design tokens.

No hard-coded colors, spacing, typography, or breakpoints.

---

## 29. Component Acceptance Criteria

A component is complete when:

✓ It is reusable.

✓ It supports all required states.

✓ It is responsive.

✓ It is accessible.

✓ It uses shared design tokens.

✓ It has no duplicated functionality.

✓ It has been documented.

✓ It has been tested in isolation.

✓ It integrates correctly with the design system.

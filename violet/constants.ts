export const CONSTANT = {
  CATEGORY: "category",
  CATEGORIES: "categories",
} as const;

export const PRICING = {
  MARKUP_MULTIPLIER: 1.1, // 10% markup for platform fees/shipping
  SHIPPING_INSIDE_CITY: 80.0,
  SHIPPING_OUTSIDE_CITY: 150.0,
} as const;

export const STATUS = {
  VALIDATING: "validating",
  ACTIVE: "active",
  SOLD: "sold",
  AWAITING: "awaiting",
  PENDING: "pending",
  DELIVERING: "delivering",
  CONFIRMING: "confirming",
  DONE: "done",
} as const;

export const TYPE = {
  SELL: "sell",
  SHARE: "share",
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

export const USER_LOCATION = "user location" as const;

export const ROLE = { ADMIN: "admin", USER: "user" } as const;

export const PRICING = {
  MARKUP_MULTIPLIER: 1.1, // 10% markup for platform fees/shipping
  SHIPPING_INSIDE_CITY: 80.0,
  SHIPPING_OUTSIDE_CITY: 150.0,
} as const;

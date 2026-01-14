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

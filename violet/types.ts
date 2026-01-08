import { z } from "zod";

export type ProductType = {
  id: string;
  sellerId: string;
  category: string;
  title: string;
  description: string;
  images: Record<string, string>;
  noOfShares: number;
  remainingShares: number;
  askingPrice: number;
};

export type BagItemType = ProductType & {
  shares: number;
};

export type CategoryType = {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export const shippingForm = z.object({
  name: z.string().min(1, "Please state your name"),
  email: z.email().optional().or(z.literal("")),
  phone: z
    .string()
    .min(11, "Please add your phone number")
    .max(14, "Invalid")
    .regex(/^\d+$/, "Invalid"),
  district: z.string().min(1, "Please enter your delivery district"),
  address: z.string().min(1, "Please enter delivery address"),
});

export type ShippingFormInputs = z.infer<typeof shippingForm>;

export type BagStoreStateType = {
  bag: BagItemType[];
  hasHydrated: boolean;
};

export type BagStoreActionsType = {
  addToBag: (product: BagItemType) => void;
  removeFromBag: (product: BagItemType) => void;
  emptyBag: () => void;
};

export type OrderType = {
  _id: string;
  noOfShares: number;
  status: "pending" | "delivering" | "confirming" | "done";
  location: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  buyerId: string | null;
  guestBuyer: boolean;
  sellerId: string;
  product: ProductType;
};

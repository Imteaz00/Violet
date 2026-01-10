import { z } from "zod";

export enum District {
  Bagerhat = "Bagerhat",
  Bandarban = "Bandarban",
  Barguna = "Barguna",
  Barishal = "Barishal",
  Bhola = "Bhola",
  Bogura = "Bogura",
  Brahmanbaria = "Brahmanbaria",
  Chandpur = "Chandpur",
  Chapainawabganj = "Chapainawabganj",
  Chattogram = "Chattogram",
  Chuadanga = "Chuadanga",
  CoxsBazar = "Cox's Bazar",
  Cumilla = "Cumilla",
  Dhaka = "Dhaka",
  Dinajpur = "Dinajpur",
  Faridpur = "Faridpur",
  Feni = "Feni",
  Gaibandha = "Gaibandha",
  Gazipur = "Gazipur",
  Gopalganj = "Gopalganj",
  Habiganj = "Habiganj",
  Jamalpur = "Jamalpur",
  Jashore = "Jashore",
  Jhalokathi = "Jhalokathi",
  Jhenaidah = "Jhenaidah",
  Joypurhat = "Joypurhat",
  Khagrachhari = "Khagrachhari",
  Khulna = "Khulna",
  Kishoreganj = "Kishoreganj",
  Kurigram = "Kurigram",
  Kushtia = "Kushtia",
  Lakshmipur = "Lakshmipur",
  Lalmonirhat = "Lalmonirhat",
  Madaripur = "Madaripur",
  Magura = "Magura",
  Manikganj = "Manikganj",
  Meherpur = "Meherpur",
  Moulvibazar = "Moulvibazar",
  Munshiganj = "Munshiganj",
  Mymensingh = "Mymensingh",
  Naogaon = "Naogaon",
  Narail = "Narail",
  Narayanganj = "Narayanganj",
  Narsingdi = "Narsingdi",
  Natore = "Natore",
  Netrokona = "Netrokona",
  Nilphamari = "Nilphamari",
  Noakhali = "Noakhali",
  Pabna = "Pabna",
  Panchagarh = "Panchagarh",
  Patuakhali = "Patuakhali",
  Pirojpur = "Pirojpur",
  Rajbari = "Rajbari",
  Rajshahi = "Rajshahi",
  Rangamati = "Rangamati",
  Rangpur = "Rangpur",
  Satkhira = "Satkhira",
  Shariatpur = "Shariatpur",
  Sherpur = "Sherpur",
  Sirajganj = "Sirajganj",
  Sunamganj = "Sunamganj",
  Sylhet = "Sylhet",
  Tangail = "Tangail",
  Thakurgaon = "Thakurgaon",
}

export type UserType = {
  id: string;
  email?: string;
  name: string;
  imageUrl?: string;
  phone?: string;
  location?: string;
  role: "user" | "admin";
  products: ProductType[];
};

export type ProductType = CreateProductType & {
  id: string;
  status: "validating" | "active" | "sold";
  createdAt: Date;
  user: UserType;
  remainingShares: number;
  //   image: any;
};

export const createProductForm = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  boughtFrom: z.string().min(1, "Please state where you bought the item from"),
  askingPrice: z
    .number({ error: "This field is required" })
    .min(1, "Asking price must be at least 1"),
  sellingReason: z.string().optional(),
  expiryDate: z.iso.date("This field is required"),
  location: z.string().optional(),
  district: z.nativeEnum(District),
  type: z.enum(["share", "sell"]),
  quantity: z.string().min(1, "Please state the available quantity"),
  condition: z.string().min(1, "State your item's condition"),
  noOfShares: z.number("This field is required").min(1, "Number of shares must be at least 1"),
  category: z.string("Please select a category").min(1, "Please select a category"),
});

export type CreateProductType = z.infer<typeof createProductForm>;

export type BagItemType = ProductType & {
  shares: number;
};

export type CategoryType = {
  slug: string;
  name: string;
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

export type OrderType = ShippingFormInputs & {
  _id: string;
  noOfShares: number;
  productId: string;
  buyerId: string | null;
  status: "pending" | "delivering" | "confirming" | "done";
  sellerId: string;
  createdAt: Date;
  product: ProductType;
  buyer: UserType | null;
  seller: UserType;
};

export type BagStoreStateType = {
  bag: BagItemType[];
  hasHydrated: boolean;
};

export type BagStoreActionsType = {
  addToBag: (product: BagItemType) => void;
  removeFromBag: (product: BagItemType) => void;
  emptyBag: () => void;
};

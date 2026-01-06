export type ProductType = {
  id: string | number; //remove number
  title: string;
  description: string;
  price: number;
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

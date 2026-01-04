export type ProductType = {
  id: string | number; //remove number
  name: string;
  description: string;
  price: number;
  images: Record<string, string>;
  noOfShares: number;
  remainingShares: number;
};

export type BagItemType = ProductType & {
  shares: number;
};

"use client";

import useBagStore from "@/stores/bagStore";
import { BagItemType, ProductType } from "@/types";

export default function RemainingShares({ product, size }: { product: ProductType; size: string }) {
  const { bag, removeFromBag, addToBag } = useBagStore();
  const shares = bag.find((item: BagItemType) => item.id === product.id)?.shares || 0;

  if (shares > product.remainingShares) {
    removeFromBag(product.id);
    if (product.remainingShares > 0) {
      addToBag({ ...product, shares: product.remainingShares });
    }
  }

  return (
    <>
      Shares:{" "}
      <span className={`text-accent-foreground text-${size}`}>
        {product.remainingShares - shares}
      </span>{" "}
      / {product.noOfShares}
    </>
  );
}

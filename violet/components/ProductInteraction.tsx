"use client";

import useBagStore from "@/stores/bagStore";
import { BagItemType, ProductType } from "@/types";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { getUserId } from "@/app/(user)/actions/user.action";
import { formatCurrency } from "../lib/formatters";
import { PRICING } from "@/constants";
import calculatePrice from "@/lib/calculatePrice";
import ShoppingBagIcon from "./ShoppingBagIcon";

export default function ProductInteraction({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);

  const { bag, addToBag } = useBagStore();
  const shares = bag.find((item: BagItemType) => item.id === product.id)?.shares || 0;

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else {
      if (quantity > 1) {
        setQuantity((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = () => {
    addToBag({
      ...product,
      shares: quantity,
    });
    toast.success("Product added to your bag", {
      className: "",
    });
  };

  useEffect(() => {
    getUserId()
      .then((id) => setUserId(id))
      .catch((error) => {
        console.error("Failed to fetch user ID:", error);
        // Optionally: show a toast notification
        toast.error("Failed to fetch user information");
      });
  }, []);

  const calculatedTotal = formatCurrency(
    product.noOfShares > 0
      ? calculatePrice(product.askingPrice, product.noOfShares) * quantity
      : product.askingPrice * PRICING.MARKUP_MULTIPLIER * quantity,
  );
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-2 text-sm">
        {product.remainingShares > 0 ? (
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              disabled={quantity === 1}
              onClick={() => handleQuantityChange("decrement")}
              className={quantity > 1 ? "transition-all duration-300 hover:scale-110" : ""}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="select-none">{quantity}</span>
            <Button
              variant={"outline"}
              disabled={quantity === product.remainingShares}
              onClick={() => handleQuantityChange("increment")}
              className={
                quantity < product.remainingShares
                  ? "transition-all duration-300 hover:scale-110"
                  : ""
              }
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="text-destructive font-medium">Sold Out</div>
        )}
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button
          variant={"secondary"}
          disabled={
            product.remainingShares === 0 ||
            product.userId === userId ||
            shares + quantity > product.remainingShares
          }
          onClick={handleAddToCart}
          className="py-2 rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm font-medium flex-1"
        >
          <span className="flex items-center gap-2 transition-transform duration-300 px-auto hover:scale-110">
            <Plus className="w-4 h-4" />
            Add to Bag <span className="text-muted-foreground">(Total: {calculatedTotal})</span>
          </span>
        </Button>
        <Button className="p-1" variant={"outline"}>
          <ShoppingBagIcon />
        </Button>
      </div>
    </div>
  );
}

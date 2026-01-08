"use client";

import useBagStore from "@/stores/bagStore";
import { ProductType } from "@/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";

export default function ProductInteraction({ product }: { product: ProductType }) {
  const [quantity, setQuantity] = useState(1);

  const { addToBag } = useBagStore();

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
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-col gap-2 text-sm">
        <span className="text-muted-foreground">Quantity</span>
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
      </div>
      <Button
        variant={"secondary"}
        onClick={handleAddToCart}
        className=" px-4 py-2 rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm font-medium"
      >
        <span className="flex items-center gap-2 transition-transform duration-300 pl-10 pr-10 hover:scale-110">
          <Plus className="w-4 h-4" />
          Add to Bag
        </span>
      </Button>
    </div>
  );
}

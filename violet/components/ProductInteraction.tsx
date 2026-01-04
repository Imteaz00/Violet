"use client";

// import useCartStore from "@/stores/cartStore";
import { ProductType } from "@/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
// import { toast } from "react-toastify";

export default function ProductInteraction({ product }: { product: ProductType }) {
    // const router = useRouter();
    // const pathname = usePathname();
    // const searchParams = useSearchParams();
    const [quantity, setQuantity] = useState(1);

    // const { addToCart } = useCartStore();

    // const handleTypeChange = (type: string, value: string) => {
    //     const params = new URLSearchParams(searchParams.toString());
    //     params.set(type, value);
    //     router.push(`${pathname}?${params.toString()}`, { scroll: false });
    // };

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
        // addToCart({
        //     ...product,
        //     quantity,
        //     selectedColor,
        //     selectedSize,
        // });
        // toast.success("Product added to cart")
    };
    return (
        <div className="flex flex-col gap-4 mt-4">
            {/* QUANTITY */}
            <div className="flex flex-col gap-2 text-sm">
                <span className="text-muted-foreground">Quantity</span>
                <div className="flex items-center gap-2">
                    <Button variant={"outline"}
                        onClick={() => handleQuantityChange("decrement")}
                    >
                        <Minus className="w-4 h-4" />
                    </Button>
                    <span>{quantity}</span>
                    {quantity === product.remainingShares ?
                        <Button variant={"outline"} disabled
                            onClick={() => handleQuantityChange("increment")}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                        :
                        <Button variant={"outline"}
                            onClick={() => handleQuantityChange("increment")}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>}
                </div>
            </div>
            {/* BUTTONS */}
            <Button variant={"secondary"}
                onClick={handleAddToCart}
                className=" px-4 py-2 rounded-md shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm font-medium"
            >
                <Plus className="w-4 h-4" />
                Add to Bag
            </Button>
        </div>
    );
};

// export default ProductInteraction;
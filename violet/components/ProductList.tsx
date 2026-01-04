import { ProductType } from "../types";
import Catagories from "./Catagories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { CONSTANT } from "@/constants";
import Filter from "./Filter";

const products: ProductType[] = [
    {
        id: 1,
        name: "Adidas CoreFit T-Shirt",
        description:
            "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
        price: 39.9,
        images: {
            gray: "/products/1g.png",
            purple: "/products/1p.png",
            green: "/products/1gr.png",
        },
        noOfShares: 4,
        remainingShares: 2
    },
    {
        id: 1,
        name: "Adidas CoreFit T-Shirt",
        description:
            "Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit. Lorem ipsum dolor sit amet consect adipisicing elit lorem ipsum dolor sit.",
        price: 39.9,
        images: {
            gray: "/products/1g.png",
            purple: "/products/1p.png",
            green: "/products/1gr.png",
        },
        noOfShares: 4,
        remainingShares: 2
    },
]
export default function ProductList({ category, params }: { category: string, params: "homepage" | "products" }) {
    return (
        <div className="w-full">
            <Catagories />
            {params === "products" && <Filter />}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <Link href={category ? `/products/?${CONSTANT.CATEGORY}=${category}` : "/products"} className="flex justify-end mt-4 underline text-sm text-muted-foreground">View All Products</Link>
        </div>
    )
}
import { ProductType } from "../types";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from '../lib/formaters';
import { Button } from "./ui/button";
import { ShoppingBagIcon } from "lucide-react";

export default function ProductCard({ product }: { product: ProductType }) {
    return (
        <div className="shadow-lg rounded-lg overflow-hidden bg-secondary">
            <Link href={`/products/${product.id}`}>
                <div className="relative aspect-5/6">
                    {/* <Image src={product.images[0]}/ alt={product.name} fill className="object-cover hover-scale-105 transition-all duration-300"> */}
                </div>
            </Link>
            <div className="flex flex-col gap-3 p-4">
                <h1 className="font-medium text-secondary-foreground">{product.title}</h1>
                <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-secondary-foreground">{formatCurrency(Math.ceil(product.askingPrice / product.noOfShares))}</p>
                        <p className="text-xs text-muted-foreground">per share</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Shares: {product.remainingShares}/{product.noOfShares}</p>
                </div>
                <Link href={`/products/${product.id}`}>
                    <Button className="transition-colors duration-300 w-full">
                        <span className="flex items-center gap-2 transition-transform duration-300 pl-10 pr-10 hover:scale-110">
                            <ShoppingBagIcon />
                            Get
                        </span>
                    </Button>
                </Link>
            </div>
        </div>
    )
}

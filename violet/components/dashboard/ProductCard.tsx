import { ProductType } from "@/types";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { Button } from "../ui/button";
import Link from "next/link";

export default function ProductCard({ product, param }: { product: ProductType; param?: string }) {
  return (
    <Item variant="outline" className="bg-card relative">
      <ItemMedia variant="image">
        <Link href={`/products/${product.id}`}>
          <div className="absolute aspect-2/3">
            {/* <Image src={product.images[0]}/ alt={product.name} fill className="object-cover hover-scale-105 transition-all duration-300"> */}
          </div>
        </Link>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{product.title}</ItemTitle>
        <ItemDescription>{product.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Link href={`/products/${product.id}`}>
          <Button
            className="transition-all duration-300 hover:scale-110"
            size="sm"
            variant="outline"
          >
            View
          </Button>
        </Link>
      </ItemActions>
    </Item>
  );
}

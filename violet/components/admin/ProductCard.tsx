import { ProductType } from "@/types";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import { Button } from "../ui/button";
import Link from "next/link";
import { Badge } from "../ui/badge";
import DeleteProduct from "../dashboard/DeleteProduct";
import { STATUS } from "@/constants";
import ValidateProduct from "./ValidateProduct";
import Image from "next/image";

export default function AdminProductCard({ product }: { product: ProductType }) {
  return (
    <Item variant="outline" className="bg-card relative">
      <ItemMedia variant="image">
        <Link href={`/admin/products/${product.id}`}>
          <div className="absolute aspect-2/3">
            {/* <Image src={product.[0]} alt={product.title} fill className="object-cover hover-scale-105 transition-all duration-300" /> */}
          </div>
        </Link>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="font-semibold text-lg">
          {product.title}{" "}
          <span className="text-muted-foreground text-sm font-light">
            Remaining: {product.remainingShares}/{product.noOfShares}
          </span>
          <Badge className="ml-2">{product.status}</Badge>
        </ItemTitle>
        <ItemDescription>{product.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Link href={`/admin/products/${product.id}`}>
          <Button
            className="transition-all duration-300 hover:scale-110"
            size="sm"
            variant="outline"
          >
            View
          </Button>
        </Link>
        {product.status === STATUS.VALIDATING && <ValidateProduct productId={product.id} />}

        <DeleteProduct productId={product.id} />
      </ItemActions>
    </Item>
  );
}

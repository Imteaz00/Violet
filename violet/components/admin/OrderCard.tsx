import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { OrderType } from "../../types";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import DeleteOrder from "./DeleteOrder";
import UpdateOrder from "./UpdateOrder";

export default function OrderCard({ order }: { order: OrderType }) {
  const getPrice = () => {
    return formatCurrency(
      Math.ceil(order.product.askingPrice / order.product.noOfShares) * order.noOfShares
    );
  };
  return (
    <Item variant="outline" className="bg-card relative">
      <ItemMedia variant="image">
        <Link href={`/products/${order.id}`}>
          <div className="absolute aspect-2/3">
            {/* <Image src={order.images[0]}/ alt={order.name} fill className="object-cover hover-scale-105 transition-all duration-300"> */}
          </div>
        </Link>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="font-semibold text-lg">
          {order.product.title}{" "}
          <span className="text-muted-foreground text-sm font-light">
            {formatDateTime(new Date(order.createdAt))}
          </span>
          <Badge className="ml-2">{order.status}</Badge>
        </ItemTitle>
        <ItemDescription>
          Share: {order.noOfShares}, Price: {getPrice()} (
          {order.paymentMethod === "cashOnDelivery" ? "Cash on Delivery" : "Bkash"})
          <div className="text-foreground">{order.transactionId}</div>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        {order.status !== "done" && <UpdateOrder order={order} />}
        <DeleteOrder orderId={order.id} />
      </ItemActions>
    </Item>
  );
}

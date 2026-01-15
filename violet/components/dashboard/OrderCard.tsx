import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { OrderType } from "../../types";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import DeleteOrder from "./DeleteOrder";

export default function OrderCard({ order }: { order: OrderType }) {
  const getPrice = () => {
    if (!order.product.noOfShares) {
      return formatCurrency(0);
    }
    return formatCurrency(
      Math.ceil(order.product.askingPrice / order.product.noOfShares) * order.noOfShares
    );
  };
  return (
    <Item variant="outline" className="bg-card relative">
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
        </ItemDescription>
      </ItemContent>
      {order.status === "pending" && (
        <ItemActions>
          <DeleteOrder orderId={order.id} />
        </ItemActions>
      )}
    </Item>
  );
}

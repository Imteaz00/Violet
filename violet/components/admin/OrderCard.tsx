import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "../ui/item";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { OrderType } from "../../types";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import DeleteOrder from "./DeleteOrder";
import UpdateOrder from "./UpdateOrder";
import calculatePrice from "@/lib/calculatePrice";

export default function OrderCard({ order }: { order: OrderType }) {
  const getPrice = () => {
    return formatCurrency(
      calculatePrice(order.product.askingPrice, order.product.noOfShares) * order.noOfShares,
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

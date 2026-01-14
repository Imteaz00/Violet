import { formatCurrency } from "@/lib/formatters";
import { BACKEND_URL } from "@/server";
import { OrderType } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const fetchOrders = async () => {
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    await redirect("/sign-in");
  }

  const res = await fetch(`${BACKEND_URL}/connections/user-connections`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.statusText}`);
  }
  const data: OrderType[] = await res.json();
  return data;
};

function calculatePrice(order: OrderType): string {
  const sharePrice =
    order.product.noOfShares > 0
      ? Math.ceil(order.product.askingPrice / order.product.noOfShares)
      : order.product.askingPrice;
  return formatCurrency(sharePrice * Number(order.noOfShares));
}

export default async function OrdersPage() {
  const orders = await fetchOrders();

  return (
    <div className="">
      <h1 className="text-2xl my-4 font-medium">Your Orders</h1>
      {orders.length === 0 ? <div>No order found</div> : null}
      <ul>
        {orders.map((order) => (
          <li key={String(order._id)} className="flex items-center mb-4">
            <div className="w-1/4">
              <span className="font-medium text-sm text-gray-500">Order ID</span>
              <p>{order._id}</p>
            </div>
            <div className="w-1/12">
              <span className="font-medium text-sm text-gray-500">Total</span>
              <p>{calculatePrice(order)}</p>
            </div>
            <div className="w-1/12">
              <span className="font-medium text-sm text-gray-500">Status</span>
              <p>{order.status}</p>
            </div>
            <div className="w-1/8">
              <span className="font-medium text-sm text-gray-500">Date</span>
              <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US") : "-"}</p>
            </div>
            <div className="">
              <span className="font-medium text-sm text-gray-500">Product</span>
              <p>{order.product.title || "-"}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

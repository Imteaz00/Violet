import fetchUserOrders from "@/actions/fetchUserOrder";
import OrderCard from "@/components/dashboard/OrderCard";

export default async function MyOrdersPage() {
  const orders = await fetchUserOrders();

  if (!orders?.length) {
    return <div>No Orders found.</div>;
  }
  return (
    <>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </>
  );
}

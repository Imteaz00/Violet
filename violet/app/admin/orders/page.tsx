import fetchAllOrders from "@/actions/fetchAllOrders";
import OrderCard from "@/components/admin/OrderCard";

export default async function FetchAllPage() {
  const orders = await fetchAllOrders();

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

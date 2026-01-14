import fetchAdminProducts from "@/actions/fetchAdminProducts";
import AdminProductCard from "@/components/admin/ProductCard";

export default async function MyProductsPage() {
  const products = await fetchAdminProducts();

  if (!products?.length) {
    return <div>No products found.</div>;
  }
  return products.map((product) => <AdminProductCard key={product.id} product={product} />);
}

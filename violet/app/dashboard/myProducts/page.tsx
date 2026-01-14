import fetchUserProducts from "@/actions/fetchUserProducts";
import ProductCard from "@/components/dashboard/ProductCard";

export default async function MyProductsPage() {
  const products = await fetchUserProducts();

  if (!products?.length) {
    return <div>No products found.</div>;
  }
  return products.map((product) => <ProductCard key={product.id} product={product} />);
}

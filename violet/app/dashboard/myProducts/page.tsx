import { getMyProducts } from "../action/dashboard.actions";
import ProductCard from "@/components/dashboard/ProductCard";

export default async function MyProductsPage() {
  const products = await getMyProducts();

  if (!products?.length) {
    return <div>No products found.</div>;
  }
  return products.map((product) => <ProductCard key={product.id} product={product} />);
}

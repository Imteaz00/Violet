import ProductList from "@/components/ProductList";

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
    type?: "sell" | "share" | undefined;
  }>;
}) {
  const { category, sort, search, type } = await searchParams;
  return (
    <div className="">
      <ProductList category={category} sort={sort} search={search} type={type} params="products" />
    </div>
  );
}

import ProductList from "@/components/ProductList";

export default async function Homepage({
  searchParams,
}: {
  searchParams: Promise<{ category: string }>;
}) {
  const category = (await searchParams).category;
  return (
    <div>
      <ProductList category={category} params="homepage" />
    </div>
  );
}

<div className="relative aspect-3/1 mb-12">
  {/* <Image src="/featured.png" alt="Featured Product" fill /> */}
</div>;

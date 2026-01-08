import ProductList from "@/components/ProductList";

export default async function ProductPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string, sort?: string, search?: string }>;
}) {

    const { category, sort, search } = await searchParams
    return (
        <div className="">
            <ProductList category={category} sort={sort} search={search} params="products" />
        </div>
    )
}

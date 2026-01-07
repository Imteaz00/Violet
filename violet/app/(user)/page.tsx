import ProductList from "@/components/ProductList";

export default async function Homepage({
    searchParams,
}: {
    searchParams: Promise<{ category: string }>;
}) {
    const category = (await searchParams).category;
    return (
        <div className="mx-auto p-4 sm:px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl">
            <ProductList category={category} params="homepage" />
        </div>

    );
};


<div className="relative aspect-3/1 mb-12">
    {/* <Image src="/featured.png" alt="Featured Product" fill /> */}
</div>
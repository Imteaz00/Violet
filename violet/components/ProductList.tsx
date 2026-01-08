import { ProductType } from "../types";
import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { CONSTANT } from "@/constants";
import Filter from "./Filter";
import SearchBar from "./SearchBar";

const fetchData = async ({
  category,
  search,
  sort,
  params,
}: {
  category?: string;
  search?: string;
  sort?: string;
  params: "homepage" | "products";
}) => {
  const queryParams = new URLSearchParams();
  if (category) queryParams.set("category", category);
  if (search) queryParams.set("search", search);
  queryParams.set("sort", sort || "newest");
  queryParams.set("limit", params === "homepage" ? "8" : "20");

  const res = await fetch(`${process.env.BACKEND_URL}/products?${queryParams.toString()}`, {
    signal: AbortSignal.timeout(10000),
    next: { revalidate: 60 }, // adjust as needed
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }
  const data: ProductType[] = await res.json();
  return data;
};

export default async function ProductList({
  category,
  sort,
  search,
  params,
}: {
  category: string | undefined;
  params: "homepage" | "products";
  sort?: string;
  search?: string;
}) {
  const products = await fetchData({ category, sort, search, params });
  return (
    <div className="w-full">
      <Categories />
      {params === "products" && (
        <div className="flex justify-between h-10 mb-5 items-center ml-5">
          <SearchBar />
          <Filter />
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {params === "homepage" && (
        <Link
          href={category ? `/products/?${CONSTANT.CATEGORY}=${category}` : "/products"}
          className="flex justify-end mt-4 underline text-sm text-muted-foreground"
        >
          View All Products
        </Link>
      )}
    </div>
  );
}

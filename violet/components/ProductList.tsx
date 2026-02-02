import Categories from "./Categories";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { CONSTANT } from "@/constants";
import Filter from "./Filter";
import SearchBar from "./SearchBar";
import fetchProducts from "@/actions/fetchProducts";
import Sort from "./Sort";

export default async function ProductList({
  category,
  sort,
  search,
  params,
  type,
}: {
  category: string | undefined;
  params: "homepage" | "products";
  sort?: string;
  search?: string;
  type?: "sell" | "share";
}) {
  const products = await fetchProducts({ category, sort, search, params, type });
  return (
    <div className="w-full">
      <Categories />
      {params === "products" && (
        <div className="flex justify-between h-10 mb-5 items-center md:ml-5">
          <SearchBar />
          <div className="flex gap-1">
            <Filter />
            <Sort />
          </div>
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

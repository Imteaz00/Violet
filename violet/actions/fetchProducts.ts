import { BACKEND_URL } from "@/server";
import { ProductType } from "@/types";

export default async function fetchProducts({
  category,
  search,
  sort,
  params,
}: {
  category?: string;
  search?: string;
  sort?: string;
  params: "homepage" | "products";
}): Promise<ProductType[]> {
  const queryParams = new URLSearchParams();
  if (category) queryParams.set("category", category);
  if (search) queryParams.set("search", search);
  queryParams.set("sort", sort || "newest");
  queryParams.set("limit", params === "homepage" ? "8" : "20");

  const res = await fetch(`${BACKEND_URL}/products?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }
  const data: ProductType[] = await res.json();
  return data;
}

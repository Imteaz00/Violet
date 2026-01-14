import { BACKEND_URL } from "@/server";
import { ProductType } from "@/types";

export default async function fetchAdminProducts(): Promise<ProductType[]> {
  const queryParams = new URLSearchParams();
  queryParams.set("limit", "1000");
  queryParams.set("status", "all");

  const res = await fetch(`${BACKEND_URL}/products?${queryParams.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }
  const data: ProductType[] = await res.json();
  return data;
}

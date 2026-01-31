import { BACKEND_URL } from "@/server";
import { ProductType } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function fetchAdminProductById(id: string): Promise<ProductType> {
  const { userId, getToken } = await auth();
  if (!userId) throw new Error("User not authenticated");
  const token = await getToken();
  if (!token) throw new Error("Failed to get authentication token");
  const res = await fetch(`${BACKEND_URL}/products/${id}/admin`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.statusText}`);
  }
  const data: ProductType = await res.json();
  return data;
}

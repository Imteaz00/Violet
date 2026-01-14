import { BACKEND_URL } from "@/server";
import { ProductType } from "@/types";
import { auth } from "@clerk/nextjs/server";

export default async function fetchUserProducts(): Promise<ProductType[]> {
  try {
    const { userId, getToken } = await auth();
    if (!userId) throw new Error("User not authenticated");
    const token = await getToken();
    const res = await fetch(`${BACKEND_URL}/products/myProduct`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.error("Failed to fetch user products:", res.status, res.statusText);
      throw new Error(`Failed to fetch user products: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user products:", error);
    return [];
  }
}

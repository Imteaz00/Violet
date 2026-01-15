import { BACKEND_URL } from "@/server";
import { OrderType } from "@/types";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function fetchAllOrders(): Promise<OrderType[]> {
  try {
    const { userId, getToken } = await auth();
    if (!userId) return [];
    const token = await getToken();

    const res = await fetch(`${BACKEND_URL}/connections/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }
    const data = await res.json();
    return data as OrderType[];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

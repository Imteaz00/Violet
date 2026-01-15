"use server";

import { BACKEND_URL } from "@/server";
import { auth } from "@clerk/nextjs/server";

export default async function deleteOrder(orderId: string) {
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  const { userId, getToken } = await auth();
  if (!userId) {
    throw new Error("Authentication required");
  }
  const token = await getToken();
  if (!token) {
    throw new Error("Failed to get authentication token");
  }
  const res = await fetch(`${BACKEND_URL}/connections/${orderId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Failed to delete order: ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}

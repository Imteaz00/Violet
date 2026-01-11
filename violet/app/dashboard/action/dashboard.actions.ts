"use server";

import { auth } from "@clerk/nextjs/server";
import { BACKEND_URL } from "@/server";
import { ProductType } from "@/types";

export async function getMyProductsCount() {
  const payload = await getMyProducts();
  return payload?.length || 0;
}

export async function getMyProducts() {
  const { userId, getToken } = await auth();
  if (!userId) return;

  const token = await getToken();
  const res = await fetch(`${BACKEND_URL}/products/myProduct`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
    credentials: "include",
  });

  if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
  const payload: ProductType[] = await res.json();
  return payload;
}

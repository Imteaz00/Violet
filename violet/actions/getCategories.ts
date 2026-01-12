"use server";

import { BACKEND_URL } from "@/server";

export async function getCategories() {
  try {
    const res = await fetch(`${BACKEND_URL}/categories`);
    if (!res.ok) {
      console.error("Failed to fetch categories:", res.statusText);
      return [];
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

"use server";

import { BACKEND_URL } from "@/server";
import { CategoryType } from "@/types";

export async function getCategories(): Promise<CategoryType[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/categories`);
    if (!res.ok) {
      console.error("Failed to fetch categories:", res.statusText);
      return [];
    }
    const data: CategoryType[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

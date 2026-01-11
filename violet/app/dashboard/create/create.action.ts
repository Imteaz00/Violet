"use server";

import { BACKEND_URL } from "@/server";
import { CreateProductType } from "@/types";
import { auth } from "@clerk/nextjs/server";
import { redirect, RedirectType } from "next/navigation";

export async function createProduct(formData: CreateProductType) {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      return { error: "Authentication required" };
    }

    const res = await fetch(`${BACKEND_URL}/products/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      throw new Error(`Failed to create product: ${res.statusText}`);
    }
  } catch (error) {
    console.error("Error creating product:", error);
  }
  redirect("/products", RedirectType.push);
}

export async function getCategories() {
  try {
    const res = await fetch(`${BACKEND_URL}/categories`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

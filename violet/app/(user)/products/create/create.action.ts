import { CreateProductType } from "@/types";
import { redirect } from "next/navigation";

export async function createProduct(formData: CreateProductType) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/products/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      throw new Error("Failed to create product");
    }
    redirect("/home");
  } catch (error) {
    console.error("Error creating product:", error);
  }
}

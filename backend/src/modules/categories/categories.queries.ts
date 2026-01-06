import { eq } from "drizzle-orm";
import { db } from "../../config/db.js";
import { categories } from "./categories.schema.js";

export const getAllCategories = async () => {
  return db.query.categories.findMany({});
};
export const getCategoryBySlug = async (slug: string) => {
  return db.query.categories.findFirst();
};

export const deleteCategory = async (slug: string) => {
  const [category] = await db.delete(categories).where(eq(categories.slug, slug)).returning();
  return category;
};

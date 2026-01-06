import type { Request, Response } from "express";
import * as categoryQueries from "./categories.queries.js";
import { getAuth } from "@clerk/express";

export const getAllCategory = async (req: Request, res: Response) => {
  try {
    const categories = await categoryQueries.getAllCategories();

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error getting categories:", error);
    res.status(500).json({ error: "Failed to get categories" });
  }
};
export const getCategoryBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const category = await categoryQueries.getCategoryBySlug(slug);

    if (!category) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    console.error("Error getting category:", error);
    res.status(500).json({ error: "Failed to get category" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { slug } = req.params;

    const existingCategory = await categoryQueries.getCategoryBySlug(slug);

    if (!existingCategory) return res.status(404).json({ error: "Category not found" });

    await categoryQueries.deleteCategory(slug);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

import type { Request, Response } from "express";
import * as productQueries from "./products.queries.js";
import { getAuth } from "@clerk/express";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productQueries.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Erros getting all products:", error);
    res.status(500).json({ error: "Failed to get all products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productQueries.getProductById(id);

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Erros getting product:", error);
    res.status(500).json({ error: "Failed to get product" });
  }
};

export const getUserProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const products = await productQueries.getProductsByUserId(userId);
    res.status(200).json(products);
  } catch (error) {
    console.error("Erros getting user product:", error);
    res.status(500).json({ error: "Failed to get user product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const {
      description,
      title,
      boughtFrom,
      sellingReason,
      expiryDate,
      location,
    } = req.body;

    if (
      !description ||
      !title ||
      !boughtFrom ||
      !sellingReason ||
      !expiryDate ||
      !location
    ) {
      return res.status(400).json({ error: "All info not provided" });
    }

    const product = await productQueries.createProduct({
      userId,
      title,
      description,
      boughtFrom,
      sellingReason,
      expiryDate,
      location,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Erros creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const {
      description,
      title,
      boughtFrom,
      sellingReason,
      expiryDate,
      location,
    } = req.body;

    const existingProduct = await productQueries.getProductById(id);

    if (!existingProduct)
      return res.status(404).json({ error: "Product not found" });

    if (existingProduct.userId != userId)
      return res.status(403).json({ error: "Can only update own products" });

    const product = await productQueries.createProduct({
      userId,
      title,
      description,
      boughtFrom,
      sellingReason,
      expiryDate,
      location,
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Erros updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;

    const existingProduct = await productQueries.getProductById(id);

    if (!existingProduct)
      return res.status(404).json({ error: "Product not found" });

    if (existingProduct.userId != userId)
      return res.status(403).json({ error: "Can only delete own products" });
    await productQueries.deleteProduct(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ errro: "Failed to delete product" });
  }
};

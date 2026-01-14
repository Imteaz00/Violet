import type { Request, Response } from "express";
import * as productQueries from "./products.queries.js";
import { getAuth } from "@clerk/express";
import { ROLE, STATUS } from "../../constants.js";
import { getUserById } from "../users/users.queries.js";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    let { sort, category, search, limit, offset, status } = req.query;

    const parsedLimit = limit ? parseInt(String(limit), 10) : 20;
    const parsedOffset = offset ? parseInt(String(offset), 10) : 0;

    if (limit && (isNaN(parsedLimit) || parsedLimit < 1)) {
      return res.status(400).json({ error: "Invalid limit parameter" });
    }

    if (offset && (isNaN(parsedOffset) || parsedOffset < 0)) {
      return res.status(400).json({ error: "Invalid offset parameter" });
    }

    const products = await productQueries.getAllProducts({
      category: category ? String(category) : "",
      search: search ? String(search) : "",
      sort: sort ? String(sort) : "",
      limit: parsedLimit,
      offset: parsedOffset,
      status: status ? String(status) : "",
    });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error getting all products:", error);
    res.status(500).json({ error: "Failed to get all products" });
  }
};

export const countProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const count = await productQueries.countProduct(userId);
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting products:", error);
    res.status(500).json({ error: "Failed to count products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productQueries.getProductById(id);

    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product:", error);
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
    console.error("Error getting user product:", error);
    res.status(500).json({ error: "Failed to get user product" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const {
      title,
      description,
      boughtFrom,
      askingPrice,
      expiryDate,
      location,
      quantity,
      condition,
      noOfShares,
      sellingReason,
      type,
      district,
      category,
    } = req.body;

    if (
      !title ||
      !description ||
      !boughtFrom ||
      !askingPrice ||
      !expiryDate ||
      !quantity ||
      !condition ||
      !district
    ) {
      return res.status(400).json({ error: "All info not provided" });
    }
    const product = await productQueries.createProduct({
      title,
      description,
      boughtFrom,
      askingPrice,
      sellingReason,
      expiryDate,
      location,
      district,
      type,
      quantity,
      condition,
      noOfShares,
      userId,
      remainingShares: noOfShares,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const {
      title,
      description,
      boughtFrom,
      askingPrice,
      expiryDate,
      location,
      quantity,
      condition,
      noOfShares,
      status,
      sellingReason,
      type,
    } = req.body;

    const existingProduct = await productQueries.getProductById(id);

    if (!existingProduct) return res.status(404).json({ error: "Product not found" });

    if (existingProduct.userId != userId)
      return res.status(403).json({ error: "Can only update own products" });

    const product = await productQueries.updateProduct(id, {
      userId: existingProduct.userId,
      title,
      description,
      boughtFrom,
      askingPrice,
      expiryDate,
      location,
      quantity,
      condition,
      sellingReason,
      type,
      noOfShares,
      status,
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    const user = await getUserById(userId!);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;

    const existingProduct = await productQueries.getProductById(id);

    if (!existingProduct) return res.status(404).json({ error: "Product not found" });

    if (existingProduct.userId != userId && user?.role !== ROLE.ADMIN)
      return res.status(403).json({ error: "Can only delete own products" });
    await productQueries.deleteProduct(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

export const validateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await getUserById(userId);
    if (user?.role !== ROLE.ADMIN) return res.status(403).json({ error: "Forbidden" });

    const { id } = req.params;
    const existingProduct = await productQueries.getProductById(id);

    if (!existingProduct) return res.status(404).json({ error: "Product not found" });

    const status = STATUS.ACTIVE;
    const product = await productQueries.updateProduct(id, { status });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error validating product:", error);
    res.status(500).json({ error: "Failed to validate product" });
  }
};

import type { Request, Response } from "express";
import * as productQueries from "./products.queries.js";
import { getAuth } from "@clerk/express";
import { ROLE, STATUS } from "../../constants.js";
import { getUserById } from "../users/users.queries.js";
import { db } from "../../config/db.js";
import { createProductImage, deleteProductImage } from "../productImages/productImages.queries.js";
import cloudinary from "cloudinary";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    let { sort, category, search, limit, offset, status, type } = req.query;

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
      type: type ? String(type) : "",
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
    const { userId } = getAuth(req);

    if (!userId) {
      const product = await productQueries.getProductById(id, false);

      if (!product) return res.status(404).json({ error: "Product not found" });
      return res.status(200).json(product);
    }

    const user = await getUserById(userId);
    const product = await productQueries.getProductById(id, user?.role === ROLE.ADMIN);
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
      images,
    } = req.body;

    if (
      !title ||
      !description ||
      !boughtFrom ||
      !askingPrice ||
      !expiryDate ||
      !quantity ||
      !condition ||
      !district ||
      !images
    ) {
      return res.status(400).json({ error: "All info not provided" });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    if (images.length > 5) {
      return res.status(400).json({ error: "A maximum of 5 images are allowed" });
    }

    const data = await db.transaction(async (tx) => {
      const product = await productQueries.createProduct(tx, {
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

      for (const image of images as { url: string; public_id: string }[]) {
        await createProductImage(tx, {
          userId,
          productId: product.id,
          url: image.url,
          id: image.public_id,
        });
      }
      return product;
    });

    res.status(201).json(data);
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

    const existingProduct = await productQueries.getProductById(id, false);

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
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await getUserById(userId);
    const { id } = req.params;

    const existingProduct = await productQueries.getProductById(id, false);

    if (!existingProduct) return res.status(404).json({ error: "Product not found" });

    if (existingProduct.userId != userId && user?.role !== ROLE.ADMIN)
      return res.status(403).json({ error: "Can only delete own products" });
    await db.transaction(async (tx) => {
      for (const image of existingProduct.productImages) {
        await cloudinary.v2.uploader.destroy(image.id);
        await deleteProductImage(tx, image.id);
      }
      await productQueries.deleteProduct(tx, id);
    });
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
    const existingProduct = await productQueries.getProductById(id, false);

    if (!existingProduct) return res.status(404).json({ error: "Product not found" });

    const status = STATUS.ACTIVE;
    const product = await productQueries.updateProduct(id, { status });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error validating product:", error);
    res.status(500).json({ error: "Failed to validate product" });
  }
};

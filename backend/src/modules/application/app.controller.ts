import { getAuth } from "@clerk/express";
import { Request, Response } from "express";
import { getUserById } from "../users/users.queries.js";
import { USER_LOCATION } from "../../constants.js";
import { db } from "../../config/db.js";
import {
  decreaseRemainingShare,
  getProductById,
} from "../products/products.queries.js";
import { PERCENTAGE } from "../../percentage.js";
import {
  createConnection,
  getConnectionById,
  updateConnection,
} from "../connections/connections.queries.js";

export const handleConnection = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { productId, noOfShares } = req.body;
    let location = req.body.location;

    if (!productId || !noOfShares) {
      return res.status(400).json({ error: "All info not provided" });
    }

    const buyer = await getUserById(userId);

    if (location === USER_LOCATION) {
      if (!buyer?.location) {
        return res.status(400).json({ error: "Location not provided" });
      }
      location = buyer.location;
    }

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const seller = await getUserById(product.userId);

    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    const price =
      ((product.askingPrice * (1 + PERCENTAGE.BUYER)) / product.noOfShares) *
      noOfShares;

    const data = await db.transaction(async (tx) => {
      if (buyer.balance < price) {
        tx.rollback();
      }
      const updatedProduct = await decreaseRemainingShare(
        tx,
        noOfShares,
        productId
      );
      if (!updatedProduct) {
        tx.rollback();
      }

      const connection = await createConnection(tx, {
        buyerId: userId,
        productId,
        noOfShares,
        sellerId: seller.id,
        location,
      });
      return { connection, updatedProduct };
    });
    if (!data) {
      return res.status(409).json({ error: "Failed to create connection" });
    }

    // if (listing.remainingShares === 0) populatListing();

    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({ error: "Failed to create connection" });
  }
};

export const handleUpdateConnection = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const existingConnection = await getConnectionById(id);

    if (!existingConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const { productId, noOfShares, location } = req.body;

    const buyer = await getUserById(userId);
    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const seller = await getUserById(product.userId);

    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    let change = 0;
    if (noOfShares) {
      change = noOfShares - existingConnection.noOfShares;
    }

    const price =
      ((product.askingPrice * (1 + PERCENTAGE.BUYER)) / product.noOfShares) *
      change;
    const data = await db.transaction(async (tx) => {
      if (buyer.balance < price) {
        tx.rollback();
      }
      const updatedListing = await decreaseRemainingShare(
        tx,
        change,
        productId
      );
      if (!updatedListing) {
        tx.rollback();
      }

      const updatedConnection = await updateConnection(tx, id, {
        buyerId: userId,
        productId,
        noOfShares,
        sellerId: seller.id,
        location,
      });
      return { updatedConnection, updatedListing };
    });

    if (!data) {
      return res.status(409).json({ error: "Failed to create connection" });
    }
    // if (listing.remainingShares === 0) finalizeConnection();

    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({ error: "Failed to create connection" });
  }
};

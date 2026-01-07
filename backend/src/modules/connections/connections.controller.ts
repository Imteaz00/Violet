import type { Request, Response } from "express";
import * as connectionQueries from "./connections.queries.js";
import { getAuth } from "@clerk/express";
import { ROLE, STATUS, USER_LOCATION } from "../../constants.js";
import { getUserById } from "../users/users.queries.js";
import { decreaseRemainingShare, getProductById } from "../products/products.queries.js";
import { PERCENTAGE } from "../../percentage.js";
import { db } from "../../config/db.js";

export const createConnection = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    const { productId, noOfShares } = req.body;
    let location = req.body.location;
    let buyer;

    if (!productId || !noOfShares) {
      return res.status(400).json({ error: "All info not provided" });
    }

    if (userId) {
      const buyer = await getUserById(userId);
      if (location === USER_LOCATION) {
        if (!buyer?.location) {
          return res.status(400).json({ error: "Location not provided" });
        }
        location = buyer.location;
      }
    } else {
      const guestBuyer = true;
      if (!location) {
        return res.status(400).json({ error: "Location not provided" });
      }
    }

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const seller = await getUserById(product.userId);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    const price =
      ((product.askingPrice * (1 + PERCENTAGE.BUYER)) / product.noOfShares) * noOfShares;

    const data = await db.transaction(async (tx) => {
      const updatedProduct = await decreaseRemainingShare(tx, noOfShares, productId);
      if (!updatedProduct) {
        tx.rollback();
      }

      const connection = await connectionQueries.createConnection(tx, {
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

export const getAllConnections = async (req: Request, res: Response) => {
  try {
    const connections = await connectionQueries.getAllConnections();
    res.status(200).json(connections);
  } catch (error) {
    console.error("Error getting connections:", error);
    res.status(500).json({ error: "Failed to get connections" });
  }
};

export const getConnectionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await connectionQueries.getConnectionById(id);

    if (!connection) return res.status(404).json({ error: "Connection not found" });
    res.status(200).json(connection);
  } catch (error) {
    console.error("Error getting connection:", error);
    res.status(500).json({ error: "Failed to get connection" });
  }
};

export const getUserConnection = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const connecions = await connectionQueries.getUserConnection(userId);
    res.status(200).json(connecions);
  } catch (error) {
    console.error("Error getting user connection:", error);
    res.status(500).json({ error: "Failed to get user connection" });
  }
};

export const updateConnectionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role !== ROLE.ADMIN) return res.status(401).json({ error: "Unauthorized" });
    const existingConnection = await connectionQueries.getConnectionById(id);
    if (!existingConnection) return res.status(404).json({ error: "Connection not found" });

    let status: "pending" | "delivering" | "confirming" | "done";
    if (existingConnection.status === STATUS.PENDING) {
      status = STATUS.DELIVERING;
    } else if (existingConnection.status === STATUS.DELIVERING) {
      status = STATUS.CONFIRMING;
    } else {
      status = STATUS.DONE;
    }

    const updatedConnection = await connectionQueries.updateConnectionStatus(id, status);
    res.status(200).json(updatedConnection);
  } catch (error) {
    console.error("Error updating connection status:", error);
    res.status(500).json({ error: "Failed to updating connection status" });
  }
};

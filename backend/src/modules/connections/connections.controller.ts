import type { Request, Response } from "express";
import * as connectionQueries from "./connections.queries.js";
import { getAuth } from "@clerk/express";
import { ROLE, STATUS, USER_LOCATION } from "../../constants.js";
import { getUserById } from "../users/users.queries.js";
import { decreaseRemainingShare, getProductById } from "../products/products.queries.js";
import { db } from "../../config/db.js";

export const createConnection = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const {
      productId,
      noOfShares,
      name,
      email,
      phone,
      district,
      address,
      paymentMethod,
      transactionId,
    } = req.body;

    if (!productId || !noOfShares || !name || !phone || !district || !address || !paymentMethod) {
      return res.status(400).json({ error: "All info not provided" });
    }

    const product = await getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    const seller = await getUserById(product.userId);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    if (noOfShares > product.remainingShares) {
      return res.status(400).json({ error: "Insufficient shares available" });
    }

    const data = await db.transaction(async (tx) => {
      const updatedProduct = await decreaseRemainingShare(tx, noOfShares, productId);
      if (!updatedProduct) {
        tx.rollback();
        throw new Error("Failed to decrease remaining shares");
      }

      const connection = await connectionQueries.createConnection(tx, {
        name,
        email,
        phone,
        district,
        address,
        buyerId: userId,
        productId,
        noOfShares,
        paymentMethod,
        transactionId,
        sellerId: seller.id,
      });
      return { connection, updatedProduct };
    });
    if (!data) {
      return res.status(409).json({ error: "Failed to delete connection" });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({ error: "Failed to create connection" });
  }
};

export const getAllConnections = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role !== ROLE.ADMIN) return res.status(403).json({ error: "Forbidden" });

    const connections = await connectionQueries.getAllConnections();
    res.status(200).json(connections);
  } catch (error) {
    console.error("Error getting connections:", error);
    res.status(500).json({ error: "Failed to get connections" });
  }
};

export const getConnectionById = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const connection = await connectionQueries.getConnectionById(id);

    if (!connection) return res.status(404).json({ error: "Connection not found" });

    const user = await getUserById(userId);
    const isAuthorized =
      connection.buyerId === userId || connection.sellerId === userId || user?.role === ROLE.ADMIN;

    if (!isAuthorized) return res.status(403).json({ error: "Forbidden" });
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

    const connections = await connectionQueries.getUserConnection(userId);
    res.status(200).json(connections);
  } catch (error) {
    console.error("Error getting user connection:", error);
    res.status(500).json({ error: "Failed to get user connection" });
  }
};

export const updateConnectionStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.role !== ROLE.ADMIN) return res.status(403).json({ error: "Forbidden" });
    const existingConnection = await connectionQueries.getConnectionById(orderId);
    if (!existingConnection) return res.status(404).json({ error: "Connection not found" });

    let status: "awaiting" | "pending" | "delivering" | "confirming" | "done";
    if (existingConnection.status === STATUS.AWAITING) {
      status = STATUS.PENDING;
    } else if (existingConnection.status === STATUS.PENDING) {
      status = STATUS.DELIVERING;
    } else if (existingConnection.status === STATUS.DELIVERING) {
      status = STATUS.CONFIRMING;
    } else if (existingConnection.status === STATUS.CONFIRMING) {
      status = STATUS.DONE;
    } else {
      return res.status(400).json({ error: "Connection is already completed" });
    }

    const updatedConnection = await connectionQueries.updateConnectionStatus(orderId, status);
    res.status(200).json(updatedConnection);
  } catch (error) {
    console.error("Error updating connection status:", error);
    res.status(500).json({ error: "Failed to update connection status" });
  }
};

export const getConnectionCount = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const count = await connectionQueries.getConnectionCount(userId);
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error getting connection count:", error);
    res.status(500).json({ error: "Failed to get connection count" });
  }
};

export const deleteConnectionStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { orderId } = req.params;
    const existingConnection = await connectionQueries.getConnectionById(orderId);

    if (!existingConnection) return res.status(404).json({ error: "Connection not found" });

    if (user?.role !== ROLE.ADMIN && userId !== existingConnection.buyerId) {
      return res.status(403).json({ error: "Can only delete own connections" });
    }

    const data = await db.transaction(async (tx) => {
      const updatedProduct = await decreaseRemainingShare(
        tx,
        -existingConnection.noOfShares,
        existingConnection.productId,
      );
      if (!updatedProduct) {
        tx.rollback();
        throw new Error("Failed to decrease remaining shares");
      }
      const deletedConnection = await connectionQueries.deleteConnection(tx, orderId);

      return deletedConnection;
    });
    if (!data) {
      return res.status(409).json({ error: "Failed to create connection" });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error deleting connection:", error);
    res.status(500).json({ error: "Failed to delete connection" });
  }
};

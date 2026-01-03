import type { Request, Response } from "express";
import * as connectionQueries from "./connections.queries.js";
import { getAuth } from "@clerk/express";
import {
  handleConnection,
  handleUpdateConnection,
} from "../application/app.controller.js";

export const createConnection = async (req: Request, res: Response) => {
  try {
    await handleConnection(req, res);
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({ error: "Failed to create connection" });
  }
};

export const getConnectionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const connection = await connectionQueries.getConnectionById(id);

    if (!connection)
      return res.status(404).json({ error: "Connection not found" });
    res.status(200).json(connection);
  } catch (error) {
    console.error("Error getting connection:", error);
    res.status(500).json({ error: "Failed to get connection" });
  }
};

export const updateConnection = async (req: Request, res: Response) => {
  try {
    await handleUpdateConnection(req, res);
  } catch (error) {
    console.error("Error creating connection:", error);
    res.status(500).json({ error: "Failed to create connection" });
  }
};

// export const finalizeConnection = async () => {};

export const deleteConnection = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;

    const existingConnection = await connectionQueries.getConnectionById(id);

    if (!existingConnection)
      return res.status(404).json({ error: "Connection not found" });

    if (existingConnection.buyerId != userId)
      return res.status(403).json({ error: "Can only delete own connection" });
    await connectionQueries.deleteConnection(id);
    res.status(200).json({ message: "Connection deleted successfully" });
  } catch (error) {
    console.error("Error deleting connection:", error);
    res.status(500).json({ error: "Failed to delete connection" });
  }
};

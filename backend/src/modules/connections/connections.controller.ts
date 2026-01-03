import type { Request, Response } from "express";
import * as connectionQueries from "./connections.queries.js";
import { getAuth } from "@clerk/express";
import { db } from "../../config/db.js";
import {
  decreaseListing,
  getListingById,
} from "../listings/listings.queries.js";
import { getUserById } from "../users/users.queries.js";
import { USER_LOCATION } from "../../constants.js";

export const createConnection = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { productId, listingId, noOfShares } = req.body;
    let location = req.body.location;

    if (!listingId || !productId || !noOfShares || !location) {
      return res.status(400).json({ error: "All info not provided" });
    }

    const buyer = await getUserById(userId);

    if (location === USER_LOCATION) {
      if (!buyer?.location) {
        return res.status(400).json({ error: "Location not provided" });
      }
      location = buyer.location;
    }

    const seller = await getUserById(userId);
    const listing = await getListingById(listingId);

    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const data = await db.transaction(async (tx) => {
      if (buyer.balance < listing?.sharePrice * noOfShares) {
        res.status(403).json({ error: "Not enough balance" });
        throw new Error("Not enough balance");
      }
      const updatedListing = await decreaseListing(tx, noOfShares, listingId);
      if (!updatedListing) {
        res.status(409).json({ error: "Failed to create connection" });
        throw new Error("Conflict creating connection");
      }

      const connection = await connectionQueries.createConnection(tx, {
        buyerId: userId,
        productId,
        noOfShares,
        listingId,
        sellerId: seller.id,
        location,
      });
      return { connection, updatedListing };
    });

    // if (listing.remainingShares === 0) populatListing();

    res.status(201).json(data);
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
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const existingConnection = await connectionQueries.getConnectionById(id);

    if (!existingConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    const { productId, listingId, noOfShares, location } = req.body;

    const buyer = await getUserById(userId);
    const seller = await getUserById(userId);
    const listing = await getListingById(listingId);

    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    const data = await db.transaction(async (tx) => {
      if (buyer.balance < listing?.sharePrice * noOfShares) {
        res.status(403).json({ error: "Not enough balance" });
        throw new Error("Not enough balance");
      }
      const updatedListing = await decreaseListing(tx, noOfShares, listingId);
      if (!updatedListing) {
        res.status(409).json({ error: "Failed to create connection" });
        throw new Error("Conflict creating connection");
      }

      const updatedConnection = await connectionQueries.updateConnection(
        tx,
        id,
        {
          buyerId: userId,
          productId,
          noOfShares,
          listingId,
          sellerId: seller.id,
          location,
        }
      );
      return { updatedConnection, updatedListing };
    });

    // if (listing.remainingShares === 0) finalizeConnection();

    res.status(201).json(data);
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

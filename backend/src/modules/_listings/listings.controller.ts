import type { Request, Response } from "express";
import * as listingQueries from "./listings.queries.js";
import { getAuth } from "@clerk/express";
import { db } from "../../config/db.js";
import { STATUS } from "../../constants.js";

// export const createListing = async (req: Request, res: Response) => {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) return res.status(401).json({ error: "Unauthorized" });

//     const { sharePrice, productId, remainingShares } = req.body;

//     if (!sharePrice || !productId || !remainingShares) {
//       return res.status(400).json({ error: "All info not provided" });
//     }

//     const listing = await db.transaction(async (tx) => {
//       listingQueries.createListing(tx, {
//         sellerId: userId,
//         sharePrice,
//         productId,
//         remainingShares,
//       });
//     });

//     res.status(201).json(listing);
//   } catch (error) {
//     console.error("Error creating listing:", error);
//     res.status(500).json({ error: "Failed to create listing" });
//   }
// };

export const getListingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await listingQueries.getListingById(id);

    if (!listing) return res.status(404).json({ error: "Listing not found" });
    res.status(200).json(listing);
  } catch (error) {
    console.error("Error getting listing:", error);
    res.status(500).json({ error: "Failed to get listing" });
  }
};

// export const updateListing = async (req: Request, res: Response) => {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) return res.status(401).json({ error: "Unauthorized" });

//     const { id } = req.params;
//     const { sharePrice, remainingShares, status } = req.body;

//     const existingListing = await listingQueries.getListingById(id);

//     if (!existingListing)
//       return res.status(404).json({ error: "Listing not found" });

//     if (existingListing.sellerId != userId)
//       return res.status(403).json({ error: "Can only update own listings" });

//     const listing = await db.transaction(async (tx) => {
//       listingQueries.updateListing(tx, id, {
//         sellerId: existingListing.sellerId,
//         sharePrice,
//         remainingShares,
//         status,
//       });
//     });

//     res.status(200).json(listing);
//   } catch (error) {
//     console.error("Error updating listing:", error);
//     res.status(500).json({ error: "Failed to update listing" });
//   }
// };

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await listingQueries.getListingById(id);
    if (!listing) {
      return res.status(403).json({ error: "Listing not found" });
    }
    switch (req.body.status) {
      case STATUS.VALIDATING:
        req.body.status = STATUS.POPULATING;
        break;
      //   case STATUS.POPULATING:
      //     req.body.status = STATUS.RECEIVING;
      //     break;
      //   case STATUS.RECEIVING:
      //     req.body.status = STATUS.DELIVERING;
      //     break;
      //   case STATUS.DELIVERING:
      //     req.body.status = STATUS.CONFIRMING;
      //     break;
      //   case STATUS.CONFIRMING:
      //     req.body.status = STATUS.DONE;
      // break;
      default:
        return res.status(400).json({ error: "Invalid status" });
    }
    const updatedListing = await db.transaction(async (tx) => {
      return listingQueries.updateListing(tx, id, {
        ...listing,
        status: req.body.status,
      });
    });
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error("Error updating Status:", error);
    res.status(500).json({ error: "Failed to update Status" });
  }
};

export const validateListing = async (req: Request, res: Response) => {
  try {
    req.body.status = STATUS.VALIDATING;
    await updateStatus(req, res);
  } catch (error) {
    console.error("Error validating Status:", error);
    res.status(500).json({ error: "Failed to validate Status" });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;

    const existingListing = await listingQueries.getListingById(id);

    if (!existingListing)
      return res.status(404).json({ error: "Listing not found" });

    if (existingListing.sellerId != userId)
      return res.status(403).json({ error: "Can only delete own listing" });
    await listingQueries.deleteListing(id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ error: "Failed to delete listing" });
  }
};

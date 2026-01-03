// import type { Request, Response } from "express";
// import * as transactionQueries from "./transactions.queries.js";
// import { getAuth } from "@clerk/express";
// import { getListingById, updateListing } from "../listings/listings.queries.js";
// import { getUserById } from "../users/users.queries.js";
// import { db } from "../../config/db.js";

// export const createTransaction = async (req: Request, res: Response) => {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) return res.status(401).json({ error: "Unauthorized" });

//     const { noOfShares, listingId, buyerId } = req.body;

//     if (!noOfShares) {
//       return res.status(400).json({ error: "No of Share not provided" });
//     }

//     if (!listingId) {
//       return res.status(400).json({ error: "Listing id not provided" });
//     }
//     if (!buyerId) {
//       return res.status(400).json({ error: "Buyer id not provided" });
//     }
//     const listingById = await getListingById(listingId);

//     if (!listingById) {
//       return res.status(404).json({ error: "Listing not found" });
//     }

//     const { seller, product, ...listing } = listingById;

//     const buyer = await getUserById(buyerId);
//     if (!buyer) {
//       return res.status(404).json({ error: "Buyer not found" });
//     }

//     if (noOfShares > listing?.remainingShares) {
//       return res.status(403).json({ error: "Not enough availabe" });
//     }

//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     if (!seller) {
//       return res.status(404).json({ error: "Seller not found" });
//     }

//     const data = await db.transaction(async (tx) => {
//       const updatedListing = updateListing(tx, listingId, {
//         ...listing,
//         remainingShares: listing.remainingShares - noOfShares,
//       });
//       const newTransaction = transactionQueries.createTransaction(tx, {
//         productName: product.title,
//         buyerName: buyer.name,
//         sellerName: seller.name,
//         noOfShares,
//         sharePrice: listing.sharePrice,
//         productId: listing.productId,
//         sellerId: listing.sellerId,
//         listingId,
//         buyerId: buyerId,
//       });
//       return { updatedListing, newTransaction };
//     });

//     res.status(201).json(data);
//   } catch (error) {
//     console.error("Error creating transaction:", error);
//     res.status(500).json({ error: "Failed to create transaction" });
//   }
// };

// export const getTransactionById = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const transaction = await transactionQueries.getTransactionById(id);

//     if (!transaction)
//       return res.status(404).json({ error: "Transaction not found" });
//     res.status(200).json(transaction);
//   } catch (error) {
//     console.error("Error getting transaction:", error);
//     res.status(500).json({ error: "Failed to get transaction" });
//   }
// };

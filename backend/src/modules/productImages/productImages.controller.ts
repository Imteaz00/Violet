// import type { Request, Response } from "express";
// import * as productImageQueries from "./productImages.queries.js";
// import { getAuth } from "@clerk/express";

// export const createProductImage = async (req: Request, res: Response) => {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) return res.status(401).json({ error: "Unauthorized" });

//     const {
//       title,
//       description,
//       boughtFrom,
//       askingPrice,
//       expiryDate,
//       location,
//       quantity,
//       condition,
//       sellingReason,
//       type,
//       noOfShares,
//     } = req.body;

//     if (
//       !description ||
//       !title ||
//       !boughtFrom ||
//       !quantity ||
//       !expiryDate ||
//       !location ||
//       !condition ||
//       !askingPrice
//     ) {
//       return res.status(400).json({ error: "All info not provided" });
//     }

//     const product = await productImageQueries.createProductImage({
//       userId,

//     });

//     res.status(201).json(product);
//   } catch (error) {
//     console.error("Error creating product:", error);
//     res.status(500).json({ error: "Failed to create product" });
//   }
// };

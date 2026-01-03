import { Router } from "express";
import * as listingControler from "./listings.controller.js";
import { requireAuth } from "@clerk/express";

const listingRouters = Router();

// listingRouters.post("/create", requireAuth(), listingControler.createListing);
listingRouters.put(
  "/:id/updateStatus",
  requireAuth(),
  listingControler.updateStatus
);
listingRouters.put(
  "/:id/validate",
  requireAuth(),
  listingControler.validateListing
);
listingRouters.get("/:id", listingControler.getListingById);
// listingRouters.put("/:id", requireAuth(), listingControler.updateListing);
listingRouters.delete("/:id", requireAuth(), listingControler.deleteListing);

export default listingRouters;

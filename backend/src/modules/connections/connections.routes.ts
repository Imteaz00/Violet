import { Router } from "express";
import * as connectionController from "./connections.controller.js";
import { requireAuth } from "@clerk/express";

const connectionRouter = Router();

connectionRouter.get("/", requireAuth(), connectionController.getAllConnections);
connectionRouter.post("/create", connectionController.createConnection);
connectionRouter.get("/user-connections", requireAuth(), connectionController.getUserConnection);
connectionRouter.get("/count", requireAuth(), connectionController.getConnectionCount);
// connectionRouter.get("/:id", requireAuth(), connectionController.getConnectionById);
connectionRouter.put("/:orderId", requireAuth(), connectionController.updateConnectionStatus);
connectionRouter.delete("/:orderId", requireAuth(), connectionController.deleteConnectionStatus);

export default connectionRouter;

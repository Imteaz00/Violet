import { Router } from "express";
import * as connectionController from "./connections.controller.js";
import { requireAuth } from "@clerk/express";

const connectionRouter = Router();

// connectionRouter.get("/", requireAuth(), connectionController.getAllConnections);
connectionRouter.post("/create", connectionController.createConnection);
connectionRouter.get("/user-connections", connectionController.getUserConnection); //using
// connectionRouter.get("/:id", requireAuth(), connectionController.getConnectionById);
// connectionRouter.put("/:id", requireAuth(), connectionController.updateConnectionStatus);

export default connectionRouter;

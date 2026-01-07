import { Router } from "express";
import * as connectionController from "./connections.controller.js";
import { requireAuth } from "@clerk/express";

const connectionRouters = Router();

connectionRouters.get("/", connectionController.getAllConnections);
connectionRouters.post("/create", connectionController.createConnection);
connectionRouters.get("/user-connections", connectionController.getUserConnection);
connectionRouters.get("/:id", connectionController.getConnectionById);
connectionRouters.put("/:id", requireAuth(), connectionController.updateConnectionStatus);

export default connectionRouters;

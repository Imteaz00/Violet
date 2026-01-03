import { Router } from "express";
import * as connectionControler from "./connections.controller.js";
import { requireAuth } from "@clerk/express";

const connectionRouters = Router();

connectionRouters.post(
  "/create",
  requireAuth(),
  connectionControler.createConnection
);

connectionRouters.get("/:id", connectionControler.getConnectionById);
connectionRouters.put(
  "/:id",
  requireAuth(),
  connectionControler.updateConnection
);
connectionRouters.delete(
  "/:id",
  requireAuth(),
  connectionControler.deleteConnection
);

export default connectionRouters;

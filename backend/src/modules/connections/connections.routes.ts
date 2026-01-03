import { Router } from "express";
import * as connectionController from "./connections.controller.js";
import { requireAuth } from "@clerk/express";

const connectionRouters = Router();

// connectionRouters.post(
//   "/create/:id",
//   requireAuth(),
//   connectionControler.createConnection
// );

connectionRouters.get("/:id", connectionController.getConnectionById);
connectionRouters.put(
  "/:id",
  requireAuth(),
  connectionController.updateConnection
);
connectionRouters.delete(
  "/:id",
  requireAuth(),
  connectionController.deleteConnection
);

export default connectionRouters;

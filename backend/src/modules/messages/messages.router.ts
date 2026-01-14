import { Router } from "express";
import * as messagesController from "./messages.controller.js";
import { requireAuth } from "@clerk/express";

const categoryRouters = Router();

categoryRouters.post("/create", requireAuth(), messagesController.createMessage);
categoryRouters.get("/count", requireAuth(), messagesController.countMessage);
// categoryRouters.get("/", requireAuth(), messagesController.getAllMessages);
categoryRouters.get("/:userId", requireAuth(), messagesController.getUserMessages);

export default categoryRouters;

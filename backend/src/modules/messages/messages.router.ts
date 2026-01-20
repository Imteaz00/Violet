import { Router } from "express";
import * as messagesController from "./messages.controller.js";
import { requireAuth } from "@clerk/express";

const messageRouters = Router();

messageRouters.post("/create", requireAuth(), messagesController.createMessage);
messageRouters.get("/count", requireAuth(), messagesController.countMessage);
messageRouters.get("/", requireAuth(), messagesController.getAllMessages);
messageRouters.get("/:userId", requireAuth(), messagesController.getUserMessages);

export default messageRouters;

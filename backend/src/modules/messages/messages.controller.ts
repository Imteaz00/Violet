import { Request, Response } from "express";
import * as messageQueries from "./messages.queries.js";
import { getAuth } from "@clerk/express";
import { getUserById } from "../users/users.queries.js";

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { receiver, text } = req.body;

    if (!receiver || !text) {
      console.error("Receiver or text missing in request body", req.body);
      return res.status(400).json({ error: "Receiver and text are required" });
    }

    const message = await messageQueries.createMessage({
      sender: userId,
      receiver: receiver === "admin" ? null : receiver,
      text,
    });
    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
};

export const countMessage = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const count = await messageQueries.countMessage(userId);
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting messages:", error);
    res.status(500).json({ error: "Failed to count messages" });
  }
};

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await getUserById(userId);
    if (user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const messages = await messageQueries.getAllMessages();

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

export const getUserMessages = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await getUserById(userId);

    const id = req.params.userId;

    if (userId !== id && user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const messages = await messageQueries.getUserMessages(id);
    await messageQueries.markMessagesAsSeen(id);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error getting user messages:", error);
    res.status(500).json({ error: "Failed to get user messages" });
  }
};

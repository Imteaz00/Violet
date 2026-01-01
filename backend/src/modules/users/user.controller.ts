import type { Request, Response } from "express";
import * as userQueries from "./users.queries";
import { getAuth } from "@clerk/express";

export async function syncUser(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { name, email, imageUrl, phone } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name required" });
    }

    const user = await userQueries.upsertUser({
      id: userId,
      name,
      email,
      imageUrl,
      phone,
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Erros syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
}

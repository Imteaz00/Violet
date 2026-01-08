import type { Request, Response } from "express";
import * as userQueries from "./users.queries.js";
import { getAuth } from "@clerk/express";

export async function syncUser(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { name, email, imageUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name required" });
    }

    const user = await userQueries.upsertUser({
      id: userId,
      name,
      email,
      imageUrl,
    });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Failed to sync user" });
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await userQueries.getUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export const recharge = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { amount, id } = req.body;

    if (!id || !amount) {
      return res.status(400).json({ error: "Id and amount required" });
    }
    if (amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const user = await userQueries.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await userQueries.updateUser(id, {
      id,
      name: user.name,
      balance: Number(user.balance) + amount,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error recharging:", error);
    res.status(500).json({ error: "Failed to recharge" });
  }
};

import { Router } from "express";
import * as userController from "./users.controller.js";
import { requireAuth } from "@clerk/express";

const userRouters = Router();

userRouters.post("/sync", requireAuth(), userController.syncUser);
userRouters.put("/recharge", requireAuth(), userController.recharge);
userRouters.get("/:id", requireAuth(), userController.getUser);

export default userRouters;

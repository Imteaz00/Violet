import { Router } from "express";
import * as userController from "./users.controller.js";
import { requireAuth } from "@clerk/express";

const userRouters = Router();

userRouters.post("/:id", requireAuth(), userController.getUser);
userRouters.post("/sync", requireAuth(), userController.syncUser);
userRouters.put("/recharge", requireAuth(), userController.recharge);

export default userRouters;

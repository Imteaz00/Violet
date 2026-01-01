import { Router } from "express";
import * as userController from "./user.controller.js";
import { requireAuth } from "@clerk/express";

const userRouters = Router();

userRouters.post("/sync", requireAuth(), userController.syncUser);

export default userRouters;

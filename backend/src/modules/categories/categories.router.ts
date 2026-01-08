import { Router } from "express";
import * as categoryController from "./categories.controller.js";
import { requireAuth } from "@clerk/express";

const categoryRouters = Router();

categoryRouters.get("/", categoryController.getAllCategory);
categoryRouters.get("/:slug", categoryController.getCategoryBySlug);
categoryRouters.delete("/:slug", requireAuth(), categoryController.deleteCategory);

export default categoryRouters;

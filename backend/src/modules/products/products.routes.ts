import { Router } from "express";
import * as productControler from "./products.controller.js";
import { requireAuth } from "@clerk/express";

const productRouters = Router();

productRouters.get("/", productControler.getAllProducts);
productRouters.get("/myProduct", requireAuth(), productControler.getUserProduct);
productRouters.post("/create", requireAuth(), productControler.createProduct);
productRouters.get("/count", requireAuth(), productControler.countProduct);
productRouters.put("/:id/validate", requireAuth(), productControler.validateProduct);
productRouters.get("/:id", productControler.getProductById);
// productRouters.put("/:id", requireAuth(), productControler.updateProduct);
productRouters.delete("/:id", requireAuth(), productControler.deleteProduct);

export default productRouters;

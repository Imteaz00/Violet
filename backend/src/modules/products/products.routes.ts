import { Router } from "express";
import * as productControler from "./products.controller.js";
import { requireAuth } from "@clerk/express";

const productRouters = Router();

productRouters.get("/", productControler.getAllProducts); //using
productRouters.get("/myProduct", requireAuth(), productControler.getUserProduct); //using
productRouters.post("/create", requireAuth(), productControler.createProduct); //using
// productRouters.put("/:id/validate", requireAuth(), productControler.validateProduct);
productRouters.get("/:id", productControler.getProductById); //using
// productRouters.put("/:id", requireAuth(), productControler.updateProduct);
// productRouters.delete("/:id", requireAuth(), productControler.deleteProduct);

export default productRouters;

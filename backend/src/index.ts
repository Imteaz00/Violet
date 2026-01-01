import express from "express";
import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import userRouters from "./modules/users/user.routes";
import productRouters from "./modules/products/product.routes";
import productImageRouters from "./modules/productImages/productImage.routes";

const app = express();

app.use(cors({ origin: ENV.frontend_url }));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({
    message: "server",
    endpoints: {
      users: "api/users",
      products: "api/products",
    },
  });
});

app.use("/api/users", userRouters);
app.use("/api/products", productRouters);
app.use("/api/productImages", productImageRouters);

app.listen(ENV.port, () =>
  console.log(`Server is running on port ${ENV.port}`)
);

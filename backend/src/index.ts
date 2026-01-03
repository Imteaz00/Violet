import express from "express";
import { ENV } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import userRouters from "./modules/users/users.routes.js";
import productRouters from "./modules/products/products.routes.js";
import listingRouters from "./modules/listings/listings.routes.js";
// import productImageRouters from "./modules/productImages/productImages.routes.js";

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

app.use("/api/listings", listingRouters);
// app.use("/api/productImages", productImageRouters);
app.use("/api/products", productRouters);
app.use("/api/users", userRouters);
app.use("/api/users", userRouters);

app.listen(ENV.port, () =>
  console.log(`Server is running on port ${ENV.port}`)
);

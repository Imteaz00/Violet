import express, { NextFunction, Request, Response } from "express";
import { ENV } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import userRouters from "./modules/users/users.routes.js";
import productRouters from "./modules/products/products.routes.js";
// import productImageRouters from "./modules/productImages/productImages.routes.js";
import connectionRouters from "./modules/connections/connections.routes.js";
import categoryRouters from "./modules/categories/categories.router.js";
// import transactionRouters from "./modules/transactions/transactions.routes.js";

const app = express();

app.use(cors({ origin: ENV.frontend_url, credentials: true }));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "server",
    endpoints: {
      users: "api/users",
      products: "api/products",
    },
  });
});
app.get("/healht", (req, res) => {
  return res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/api/categories", categoryRouters);
app.use("/api/connections", connectionRouters);
// app.use("/api/productImage", productImageRouters);
app.use("/api/products", productRouters);
// app.use("/api/transaction", transactionRouters);
app.use("/api/users", userRouters);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

app.listen(ENV.port, () => console.log(`Server is running on port ${ENV.port}`));

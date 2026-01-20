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
import messageRouters from "./modules/messages/messages.router.js";
import rateLimit from "express-rate-limit";

const app = express();

const rateLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 20, // limit each IP to 20 requests per windowMs
  message: "Too many requests, please try again later.",
  skip: (req) => req.path === "/health",
});

if (!ENV.frontend_url) {
  throw new Error("Frontend URL is missing.");
}

app.use(cors({ origin: ENV.frontend_url, credentials: true }));
app.use(rateLimiter);
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
app.get("/health", (req, res) => {
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
app.use("/api/messages", messageRouters);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});

app.listen(ENV.port, () => console.log(`Server is running on port ${ENV.port}`));

import express from "express";
import { ENV } from "./config/env.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

const app = express();

app.use(cors({ origin: ENV.frontend_url }));
app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({
    message: "server",
    endpoints: {},
  });
});

app.listen(ENV.port, () =>
  console.log(`Server is running on port ${ENV.port}`)
);

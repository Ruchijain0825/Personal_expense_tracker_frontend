import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json({ limit: "20kb" }));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Personal Finance Tracker API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;
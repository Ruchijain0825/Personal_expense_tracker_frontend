import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import { createTransaction, getTransactions, deleteTransaction , updateTransaction,  getTransactionById,  getTransactionSummary} from "../controllers/transaction.controller.js";

const router = express.Router();


router.use(authMiddleware);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.delete("/:id", deleteTransaction);
router.patch("/:id", updateTransaction);
router.get("/:id", getTransactionById);
router.get("/summary", getTransactionSummary);

export default router;
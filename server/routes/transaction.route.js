import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import { createTransaction, getTransactions, deleteTransaction , updateTransaction,} from "../controllers/transaction.controller.js";

const router = express.Router();


router.use(authMiddleware);

router.post("/", createTransaction);
router.get("/", getTransactions);
router.delete("/:id", deleteTransaction);
router.patch("/:id", updateTransaction);

export default router;
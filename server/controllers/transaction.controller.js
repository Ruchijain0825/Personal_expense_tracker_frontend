import mongoose from "mongoose";
import Transaction from "../models/transaction.model.js";

export const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Type must be income or expense",
      });
    }

    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > 1000000000
    ) {
      return res.status(400).json({
        message: "Amount must be a valid positive number",
      });
    }

    if (
      typeof category !== "string" ||
      !category.trim() ||
      category.trim().length > 50
    ) {
      return res.status(400).json({
        message: "A valid category is required",
      });
    }

    if (
      description !== undefined &&
      (typeof description !== "string" ||
        description.length > 300)
    ) {
      return res.status(400).json({
        message: "Description must be at most 300 characters",
      });
    }

    let transactionDate = new Date();

    if (date !== undefined) {
      if (
        typeof date !== "string" ||
        !date.trim() ||
        !Number.isFinite(Date.parse(date))
      ) {
        return res.status(400).json({
          message: "Invalid transaction date",
        });
      }

      transactionDate = new Date(date);
    }

    const transaction = await Transaction.create({
      userId: req.user.userId,
      type,
      amount,
      category: category.trim(),
      description: description?.trim() || "",
      date: transactionDate,
    });

    return res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        message: "Page must be positive; limit must be between 1 and 100",
      });
    }

    const filter = { userId: req.user.userId };

    if (req.query.type !== undefined) {
      if (!["income", "expense"].includes(req.query.type)) {
        return res.status(400).json({
          message: "Invalid transaction type",
        });
      }

      filter.type = req.query.type;
    }

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Transaction.countDocuments(filter),
    ]);

    return res.status(200).json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user.userId,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Delete transaction error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    const { type, amount, category, description, date } = req.body;

    const updates = {};

    if (type !== undefined) {
      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({
          message: "Type must be income or expense",
        });
      }

      updates.type = type;
    }

    if (amount !== undefined) {
      if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        amount > 1000000000
      ) {
        return res.status(400).json({
          message: "Invalid amount",
        });
      }

      updates.amount = amount;
    }

    if (category !== undefined) {
      if (
        typeof category !== "string" ||
        !category.trim() ||
        category.trim().length > 50
      ) {
        return res.status(400).json({
          message: "Invalid category",
        });
      }

      updates.category = category.trim();
    }

    if (description !== undefined) {
      if (
        typeof description !== "string" ||
        description.length > 300
      ) {
        return res.status(400).json({
          message: "Invalid description",
        });
      }

      updates.description = description.trim();
    }

    if (date !== undefined) {
      if (
        typeof date !== "string" ||
        !date.trim() ||
        !Number.isFinite(Date.parse(date))
      ) {
        return res.status(400).json({
          message: "Invalid date",
        });
      }

      updates.date = new Date(date);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "Provide at least one field to update",
      });
    }

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.userId,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getTransactionSummary = async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      totalIncome: 0,
      totalExpense: 0,
      transactionCount: 0,
      balance: 0,
    };

    for (const item of summary) {
      if (item._id === "income") {
        result.totalIncome = item.total;
      }

      if (item._id === "expense") {
        result.totalExpense = item.total;
      }

      result.transactionCount += item.count;
    }

    result.balance = result.totalIncome - result.totalExpense;

    return res.status(200).json(result);
  } catch (error) {
    console.error("Summary error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate transaction ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    // Find transaction belonging to the logged-in user
    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user.userId,
    }).lean();

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      message: "Transaction fetched successfully",
      transaction,
    });
  } catch (error) {
    console.error("Get transaction error:", error.message);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
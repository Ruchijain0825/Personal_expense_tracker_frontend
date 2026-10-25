import { extractExpense } from "../services/expenseAi.service.js";

export const previewAITransaction = async (req, res) => {
  try {
    const { message } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.trim().length > 1000
    ) {
      return res.status(400).json({
        message: "Enter a transaction description of up to 1000 characters",
      });
    }

    const extractedExpense = await extractExpense(message.trim());

   
    const { date } = extractedExpense;
    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (
      !Number.isFinite(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      return res.status(422).json({
        message: "AI returned an invalid transaction date",
      });
    }

    return res.status(200).json({
      message: "Transaction details extracted successfully",
      transaction: extractedExpense,
    });
  } catch (error) {
    console.error("AI transaction preview error:", error.message);

    return res.status(502).json({
      message: "Unable to extract transaction details. Please try again.",
    });
  }
};
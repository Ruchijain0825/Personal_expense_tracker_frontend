import { useState } from "react";
import toast from "react-hot-toast";
import {  previewAITransaction,  createTransaction} from "../services/TransactionService.js";

const initialTransaction = () => ({
  type: "expense",
  amount: "",
  category: "Food",
  description: "",
  date: new Date().toLocaleDateString("en-CA"),
});

const categories = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Health",
  "Education",
  "Salary",
  "Entertainment",
  "Other",
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

export default function AISmartEntry() {
  const [message, setMessage] = useState("");
  const [transaction, setTransaction] = useState(initialTransaction);
  const [previewReady, setPreviewReady] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    if (!message.trim()) {
      return toast.error("Please describe your transaction first.");
    }

    try {
      setGenerating(true);
      setPreviewReady(false);

      const response = await previewAITransaction(message.trim());

      const extracted = response.transaction;

      if (!extracted) {
        throw new Error("AI could not extract transaction details.");
      }

      setTransaction({
        type: extracted.type || "expense",
        amount: extracted.amount ?? "",
        category: extracted.category || "Other",
        description: extracted.description || "",
        date: extracted.date || new Date().toLocaleDateString("en-CA"),
      });

      setPreviewReady(true);
      toast.success("Transaction details extracted!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to generate preview."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setTransaction((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (
      !transaction.amount ||
      Number(transaction.amount) <= 0 ||
      !transaction.description.trim() ||
      !transaction.date
    ) {
      return toast.error("Please enter all required transaction details.");
    }

    try {
      setSaving(true);

      await createTransaction({
        ...transaction,
        amount: Number(transaction.amount),
      });

      toast.success("Transaction saved successfully!");

      setMessage("");
      setTransaction(initialTransaction());
      setPreviewReady(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save transaction."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setMessage("");
    setTransaction(initialTransaction());
    setPreviewReady(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-2xl text-white shadow-lg shadow-violet-200">
            ✨
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              AI Smart Entry
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Add transactions using AI-powered input.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-6">
        {/* Input Card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800">
              Describe your transaction
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Just type naturally. AI will extract the details for you.
            </p>
          </div>

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={500}
            rows={5}
            placeholder="Example: I spent 450 rupees on Swiggy today..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
          />

          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>Write in English or Hindi</span>
            <span>{message.length}/500</span>
          </div>

          {/* Example prompts */}
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Try these examples
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                "Spent 450 on Swiggy today",
                "Paid 1200 for electricity bill",
                "Received salary of 50000 today",
                "Spent 300 on cab yesterday",
              ].map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setMessage(example)}
                  className="rounded-full border border-slate-200 px-3 py-2 text-xs text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating || !message.trim()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generating ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Analyzing transaction...
              </>
            ) : (
              <>
                ✨ Generate Preview
              </>
            )}
          </button>
        </section>

        {/* Preview Card */}
        {previewReady && (
          <section className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm">
            <div className="border-b border-violet-100 bg-violet-50 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Transaction Preview
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Review and edit the extracted details.
                  </p>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  AI Generated
                </span>
              </div>

              <div className="mt-5 rounded-xl bg-white p-4">
                <p className="text-xs text-slate-500">
                  Transaction Amount
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Transaction Type
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {["expense", "income"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setTransaction((prev) => ({ ...prev, type }))
                      }
                      className={`rounded-xl border p-3 text-sm font-semibold capitalize transition ${
                        transaction.type === type
                          ? type === "expense"
                            ? "border-rose-300 bg-rose-50 text-rose-600"
                            : "border-emerald-300 bg-emerald-50 text-emerald-600"
                          : "border-slate-200 text-slate-500"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Amount (₹)
                </label>

                <input
                  type="number"
                  name="amount"
                  min="0.01"
                  step="0.01"
                  value={transaction.amount}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  value={transaction.description}
                  onChange={handleChange}
                  placeholder="Transaction description"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={transaction.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Transaction Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={transaction.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "✓ Confirm & Save"}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
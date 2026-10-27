
import { useState } from "react";
import toast from "react-hot-toast";
import { Wallet, ArrowDownLeft, ArrowUpRight, CalendarDays, FileText } from "lucide-react";
import { createTransaction} from "../services/TransactionService.js";

const categories = {
  expense: ["Food", "Transport", "Shopping", "Bills", "Health", "Entertainment", "Education", "Other"],
  income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Other"]
};

const today = () => new Date().toLocaleDateString("en-CA");

const initialForm = {
  type: "expense",
  amount: "",
  category: "",
  description: "",
  date: today()
};

export default function ManualEntry() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === "type" ? { category: "" } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) {
      return toast.error("Enter an amount greater than zero.");
    }
    if (!form.category) return toast.error("Please select a category.");
    if (form.description.length > 300) return toast.error("Description must be under 300 characters.");

    try {
      setLoading(true);
      await createTransaction({ ...form, amount: Number(form.amount) });
      toast.success("Transaction added successfully!");
      setForm({ ...initialForm, date: today() });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  const isExpense = form.type === "expense";

  return (
    <div className="min-h-screen bg-slate-50 p-5 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="text-sm font-medium text-violet-600">TRANSACTION MANAGEMENT</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800">Manual Entry</h1>
          <p className="mt-2 text-sm text-slate-500">Record your income and expenses.</p>
        </header>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <label className="mb-3 block text-sm font-semibold text-slate-700">Transaction Type</label>
          <div className="mb-7 grid grid-cols-2 gap-3">
            {[{ value: "expense", label: "Expense", icon: ArrowUpRight }, { value: "income", label: "Income", icon: ArrowDownLeft }].map(({ value, label, icon: Icon }) => (
              <button key={value} type="button" onClick={() => setForm((prev) => ({ ...prev, type: value, category: "" }))} className={`flex items-center justify-center gap-2 rounded-xl border p-4 font-medium transition ${form.type === value ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                <Icon size={20} /> {label}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="mb-2 block text-sm font-semibold text-slate-700">Amount (₹)</label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
              <Wallet size={20} className="text-slate-400" />
              <input id="amount" name="amount" type="number" min="0.01" max="1000000000" step="0.01" required value={form.amount} onChange={handleChange} placeholder="Enter amount" className="w-full py-4 text-lg outline-none" />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="category" className="mb-2 block text-sm font-semibold text-slate-700">Category</label>
            <select id="category" name="category" required value={form.category} onChange={handleChange} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none focus:border-violet-500">
              <option value="">Select category</option>
              {categories[form.type].map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-slate-700">Description <span className="font-normal text-slate-400">(optional)</span></label>
            <div className="flex items-start gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-violet-500">
              <FileText size={20} className="mt-4 text-slate-400" />
              <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} maxLength={300} placeholder="What was this transaction for?" className="w-full resize-y py-3 outline-none" />
            </div>
            <p className="mt-1 text-right text-xs text-slate-400">{form.description.length}/300</p>
          </div>

          <div className="mb-8">
            <label htmlFor="date" className="mb-2 block text-sm font-semibold text-slate-700">Transaction Date</label>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-4">
              <CalendarDays size={20} className="text-slate-400" />
              <input id="date" name="date" type="date" required value={form.date} onChange={handleChange} max={today()} className="w-full py-3.5 outline-none" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-violet-600 px-5 py-4 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Saving Transaction..." : `Add ${isExpense ? "Expense" : "Income"}`}
          </button>
        </form>
      </div>
    </div>
  );
}

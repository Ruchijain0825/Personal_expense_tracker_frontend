
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Search,  Trash2,  RefreshCw,   ArrowDownLeft, ArrowUpRight} from "lucide-react";

import {getTransactions,  deleteTransaction} from "../services/TransactionService.js";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await getTransactions();

      const data = Array.isArray(response)
        ? response
        : response?.transactions ?? response?.data ?? [];

      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const categories = [
    ...new Set(transactions.map((item) => item.category).filter(Boolean)),
  ];

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesSearch = [
        item.description,
        item.category,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(search.toLowerCase())
        );

      const matchesType =
        type === "all" ||
        item.type?.toLowerCase() === type;

      const matchesCategory =
        category === "all" || item.category === category;

      const date = item.date
        ? new Date(item.date).toISOString().slice(0, 10)
        : "";

      const matchesStart = !startDate || date >= startDate;
      const matchesEnd = !endDate || date <= endDate;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesStart &&
        matchesEnd
      );
    });
  }, [transactions, search, type, category, startDate, endDate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await deleteTransaction(id);

      setTransactions((previous) =>
        previous.filter((item) => (item._id || item.id) !== id)
      );

      toast.success("Transaction deleted");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete transaction"
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Transactions
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              View and manage your income and expenses.
            </p>
          </div>

          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 outline-none focus:border-violet-500"
            />
          </div>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-violet-500"
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-violet-500"
          >
            <option value="all">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch("");
              setType("all");
              setCategory("all");
              setStartDate("");
              setEndDate("");
            }}
            className="rounded-xl bg-violet-50 px-3 py-2.5 text-sm font-medium text-violet-700 hover:bg-violet-100"
          >
            Clear filters
          </button>

          <label className="text-xs text-slate-500">
            From date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-sm"
            />
          </label>

          <label className="text-xs text-slate-500">
            To date
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-sm"
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <h2 className="font-semibold text-slate-900">
              All Transactions
            </h2>

            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              {filteredTransactions.length} records
            </span>
          </div>

          {loading ? (
            <p className="p-10 text-center text-slate-500">
              Loading transactions...
            </p>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-medium text-slate-700">
                No transactions found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Add a transaction or change your filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Transaction</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Amount</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((item) => {
                    const id = item._id || item.id;
                    const isIncome =
                      item.type?.toLowerCase() === "income";

                    return (
                      <tr key={id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-xl p-2 ${
                                isIncome
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-rose-50 text-rose-600"
                              }`}
                            >
                              {isIncome ? (
                                <ArrowDownLeft size={18} />
                              ) : (
                                <ArrowUpRight size={18} />
                              )}
                            </div>

                            <div>
                              <p className="font-medium text-slate-800">
                                {item.description || item.category || "Transaction"}
                              </p>
                              <p className="mt-1 text-xs capitalize text-slate-500">
                                {item.type}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {item.category || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(item.date)}
                        </td>

                        <td
                          className={`whitespace-nowrap px-5 py-4 font-semibold ${
                            isIncome
                              ? "text-emerald-600"
                              : "text-rose-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(item.amount)}
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleDelete(id)}
                            aria-label="Delete transaction"
                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

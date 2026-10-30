import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getTransactions } from "../services/TransactionService.js";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

// Parse date without accidentally changing the calendar day.
function getLocalDate(value) {
  if (!value) return null;

  const dateString = String(value).slice(0, 10);
  const parts = dateString.split("-").map(Number);

  if (
    parts.length !== 3 ||
    parts.some((part) => !Number.isInteger(part))
  ) {
    return null;
  }

  const [year, month, day] = parts;
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getTransactionDate(transaction) {
  return getLocalDate(transaction.date || transaction.createdAt);
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Calendar() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() =>
    getDateKey(new Date())
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchTransactions() {
      try {
        setLoading(true);

        const response = await getTransactions();

        const data = Array.isArray(response)
          ? response
          : response?.transactions ??
            response?.data?.transactions ??
            response?.data ??
            [];

        if (!Array.isArray(data)) {
          throw new Error("Invalid transactions response.");
        }

        if (!cancelled) {
          setTransactions(data);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error.response?.data?.message ||
              "Unable to load transactions."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchTransactions();

    return () => {
      cancelled = true;
    };
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  // Group transactions by calendar date.
  const transactionsByDate = useMemo(() => {
    const grouped = {};

    transactions.forEach((transaction) => {
      const date = getTransactionDate(transaction);

      if (!date) return;

      const key = getDateKey(date);

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(transaction);
    });

    return grouped;
  }, [transactions]);

  // Generate calendar cells, including leading and trailing blanks.
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
      const dayNumber = index - firstDay + 1;

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        return null;
      }

      return new Date(year, month, dayNumber);
    });
  }, [year, month]);

  const selectedTransactions = transactionsByDate[selectedDate] || [];

  const dailyExpenses = selectedTransactions
    .filter(
      (transaction) =>
        transaction.type?.toLowerCase() === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + (Number(transaction.amount) || 0),
      0
    );

  const dailyIncome = selectedTransactions
    .filter(
      (transaction) =>
        transaction.type?.toLowerCase() === "income"
    )
    .reduce(
      (total, transaction) =>
        total + (Number(transaction.amount) || 0),
      0
    );

  function changeMonth(offset) {
    const nextMonth = new Date(year, month + offset, 1);

    setCurrentDate(nextMonth);

    // Select the first day of the newly displayed month.
    setSelectedDate(getDateKey(nextMonth));
  }

  function isToday(date) {
    return date && getDateKey(date) === getDateKey(new Date());
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-8">
        <p className="text-sm font-medium text-violet-600">
          PERSONAL FINANCE
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Calendar
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Track your income and expenses day by day.
        </p>
      </header>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Selected day · Expenses
          </p>

          <p className="mt-2 text-2xl font-bold text-rose-600">
            {formatCurrency(dailyExpenses)}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Selected day · Income
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatCurrency(dailyIncome)}
          </p>
        </div>
      </div>

      {/* Calendar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        {/* Month navigation */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="Previous month"
            className="rounded-xl border border-slate-200 px-4 py-2 text-lg text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
          >
            ←
          </button>

          <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
            {monthName}
          </h2>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="Next month"
            className="rounded-xl border border-slate-200 px-4 py-2 text-lg text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
          >
            →
          </button>
        </div>

        {/* Legend */}
        <div className="mb-5 flex flex-wrap gap-4 text-xs text-slate-600 sm:text-sm">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            Expense
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Income
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
            Today
          </span>
        </div>

        {/* Weekday headings */}
        <div className="grid grid-cols-7 border-b border-slate-100 pb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-slate-500 sm:text-sm"
              >
                {day}
              </div>
            )
          )}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-20 border-b border-slate-100 sm:min-h-28"
                />
              );
            }

            const key = getDateKey(date);
            const dayTransactions = transactionsByDate[key] || [];
            const isSelected = selectedDate === key;

            const hasExpense = dayTransactions.some(
              (item) => item.type?.toLowerCase() === "expense"
            );

            const hasIncome = dayTransactions.some(
              (item) => item.type?.toLowerCase() === "income"
            );

            return (
              <button
                type="button"
                key={key}
                onClick={() => setSelectedDate(key)}
                aria-pressed={isSelected}
                className={`min-h-20 border-b border-slate-100 p-1 text-left transition sm:min-h-28 sm:p-3 ${
                  isSelected
                    ? "bg-violet-50 ring-1 ring-inset ring-violet-300"
                    : "hover:bg-slate-50"
                }`}
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold sm:h-8 sm:w-8 sm:text-sm ${
                    isToday(date)
                      ? "bg-violet-600 text-white"
                      : isSelected
                        ? "bg-violet-100 text-violet-700"
                        : "text-slate-700"
                  }`}
                >
                  {date.getDate()}
                </span>

                {/* Transaction indicators */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {hasExpense && (
                    <span
                      title="Expense recorded"
                      className="h-2 w-2 rounded-full bg-rose-500"
                    />
                  )}

                  {hasIncome && (
                    <span
                      title="Income recorded"
                      className="h-2 w-2 rounded-full bg-emerald-500"
                    />
                  )}
                </div>

                {/* Transaction count */}
                {dayTransactions.length > 0 && (
                  <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                    {dayTransactions.length}{" "}
                    {dayTransactions.length === 1
                      ? "transaction"
                      : "transactions"}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected date details */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Transactions for{" "}
            {new Date(
              Number(selectedDate.slice(0, 4)),
              Number(selectedDate.slice(5, 7)) - 1,
              Number(selectedDate.slice(8, 10))
            ).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Income and expenses recorded on the selected date.
          </p>
        </div>

        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading transactions...
          </p>
        ) : selectedTransactions.length === 0 ? (
          <div className="rounded-xl bg-slate-50 px-4 py-10 text-center">
            <div className="text-3xl">📅</div>

            <p className="mt-3 font-medium text-slate-700">
              No transactions for this date
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Select another date to view its transactions.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedTransactions.map((transaction, index) => {
              const isExpense =
                transaction.type?.toLowerCase() === "expense";

              return (
                <div
                  key={transaction._id || transaction.id || index}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">
                      {transaction.description ||
                        transaction.title ||
                        transaction.category ||
                        "Transaction"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {transaction.category || "Other"}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        isExpense
                          ? "bg-rose-50 text-rose-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {transaction.type || "Other"}
                    </span>
                  </div>

                  <p
                    className={`shrink-0 font-bold ${
                      isExpense
                        ? "text-rose-600"
                        : "text-emerald-600"
                    }`}
                  >
                    {isExpense ? "− " : "+ "}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
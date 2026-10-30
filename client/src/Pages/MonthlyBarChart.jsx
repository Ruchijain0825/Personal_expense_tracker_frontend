import {   BarChart,  Bar,   XAxis, YAxis, CartesianGrid, Tooltip,ResponsiveContainer } from "recharts";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function MonthlyBarChart({ transactions = [] }) {
  const currentYear = new Date().getFullYear();

  const data = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(currentYear, index, 1).toLocaleDateString(
      "en-IN",
      { month: "short" }
    ),
    monthIndex: index,
    expense: 0,
  }));

  transactions.forEach((item) => {
    if (item.type?.toLowerCase() !== "expense" || !item.date) {
      return;
    }

    const date = new Date(item.date);

    if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== currentYear
    ) {
      return;
    }

    data[date.getMonth()].expense += Number(item.amount || 0);
  });

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">
        Monthly Expenses
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Expense trends for {currentYear}
      </p>

      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="month" />

            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(value)
              }
            />

            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
            />

            <Bar
              dataKey="expense"
              name="Expense"
              fill="#8b5cf6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
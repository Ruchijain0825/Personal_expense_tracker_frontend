import {  PieChart,  Pie, Cell, Tooltip,  ResponsiveContainer,  Legend } from "recharts";

const COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#06b6d4",
  "#64748b",
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function ExpensePieChart({ transactions = [] }) {
  const categoryTotals = transactions
    .filter(
      (item) => item.type?.toLowerCase() === "expense"
    )
    .reduce((acc, item) => {
      const category = item.category || "Other";

      acc[category] =
        (acc[category] || 0) + Number(item.amount || 0);

      return acc;
    }, {});

  const data = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-slate-900">
        Expenses by Category
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Distribution of your recorded expenses
      </p>

      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-slate-500">
          No expense data available yet.
        </div>
      ) : (
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={3}
              >
                {data.map((item, index) => (
                  <Cell
                    key={item.category}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
              />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
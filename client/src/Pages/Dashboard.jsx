import { ArrowDownLeft, ArrowUpRight, Wallet, Activity } from "lucide-react";

const summaryCards = [
  { title: "Total Balance", amount: "₹0.00", icon: Wallet, color: "bg-violet-100 text-violet-600" },
  { title: "Total Income", amount: "₹0.00", icon: ArrowDownLeft, color: "bg-emerald-100 text-emerald-600" },
  { title: "Total Expenses", amount: "₹0.00", icon: ArrowUpRight, color: "bg-rose-100 text-rose-600" },
  { title: "Savings", amount: "₹0.00", icon: Activity, color: "bg-blue-100 text-blue-600" }
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-8">
        
      </header>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ title, amount, icon: Icon, color }) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <span className={`rounded-xl p-3 ${color}`}><Icon size={21} /></span>
            </div>
            <p className="mt-5 text-2xl font-bold text-slate-800">{amount}</p>
            <p className="mt-2 text-xs text-slate-400">No transaction data yet</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <h2 className="text-lg font-semibold text-slate-800">Income vs Expenses</h2>
          <p className="mt-1 text-sm text-slate-500">Your financial activity will appear here.</p>
          <div className="flex h-64 items-center justify-center text-sm text-slate-400">
            No transaction data available yet
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
          <p className="mt-1 text-sm text-slate-500">Your latest income and expenses.</p>
          <div className="flex h-64 items-center justify-center text-center text-sm text-slate-400">
            No transactions yet
          </div>
        </div>
      </section>
    </div>
  );
}
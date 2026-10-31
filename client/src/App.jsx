
import { lazy, Suspense, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import toast from "react-hot-toast";
import { getTransactions } from "./services/TransactionService.js";

const Dashboard = lazy(() => import("./Pages/Dashboard.jsx"));
const ManualEntry = lazy(() => import("./Pages/ManualEntry.jsx"));
const Transactions = lazy(() => import("./Pages/Transactions.jsx"));
const Calendar = lazy(() => import("./Pages/Calendar.jsx"));
const ExpensePieChart = lazy(() =>import("./Pages/ExpensePieChart.jsx"));
const MonthlyBarChart = lazy(() =>import("./Pages/MonthlyBarChart.jsx"));
const AISmartEntry = lazy(() => import("./Pages/AiExpenseEntry.jsx"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
    </div>
  );
}

function PlaceholderPage({ title, description }) {
  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <h1 className="text-2xl font-bold text-slate-800">
        {title}
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-8 flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-400">
          This feature is coming soon.
        </p>
      </div>
    </div>
  );
}

function Reports() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getTransactions();

        const data = Array.isArray(response)
          ? response
          : response?.transactions ??
            response?.data?.transactions ??
            response?.data ??
            [];

        if (!Array.isArray(data)) {
          throw new Error("Unexpected transactions API response.");
        }

        setTransactions(data);
      } catch (err) {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Unable to load transactions.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Reports
        </h1>

        <p className="mt-2 text-slate-500">
          Analyze your monthly spending and financial trends.
        </p>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Suspense fallback={<PageLoader />}>
          <ExpensePieChart transactions={transactions} />
        </Suspense>

        <Suspense fallback={<PageLoader />}>
          <MonthlyBarChart transactions={transactions} />
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const renderPage = () => {
    switch (activePage) {
      case "Dashboard":
        return <Dashboard />;

      case "Transactions":
        return <Transactions />;

      case "Manual Entry":
        return <ManualEntry />;

      case "Reports":
        return <Reports />;

      case "AI Smart Entry":
        return <AISmartEntry/>

         case "Calendar":
            return <Calendar />;

      case "Settings":
        return (
          <PlaceholderPage
            title="Settings"
            description="Manage your account and application preferences."
          />
        );

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="min-w-0 flex-1">
        <Suspense fallback={<PageLoader />}>
          {renderPage()}
        </Suspense>
      </main>
    </div>
  );
}

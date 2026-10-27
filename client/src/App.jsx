import { lazy, Suspense, useState } from "react";
import Sidebar from "./components/Sidebar";

const Dashboard = lazy(() => import("./Pages/Dashboard"));
const ManualEntry = lazy(() => import("./Pages/ManualEntry"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="min-w-0 flex-1">
        <Suspense fallback={<PageLoader />}>
          {activePage === "Dashboard" && <Dashboard />}
          {activePage === "Manual Entry" && <ManualEntry />}

          {!["Dashboard", "Manual Entry"].includes(activePage) && (
            <div className="p-8">
              <h1 className="text-2xl font-bold text-slate-800">
                {activePage}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                This page will be available soon.
              </p>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  );
}
import {
  Sparkles,
  LayoutDashboard,
  ArrowLeftRight,
  PlusCircle,
  CalendarDays,
  ChartNoAxesCombined,
  Settings,
  Wallet
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Transactions", icon: ArrowLeftRight },
  { label: "Manual Entry", icon: PlusCircle },
  { label: "AI Smart Entry", icon: Sparkles },
  { label: "Calendar", icon: CalendarDays },
  { label: "Reports", icon: ChartNoAxesCombined }
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-[#17172B] px-5 py-7 text-gray-400">
      <div className="mb-12 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
          <Wallet size={23} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">SpendWise</h2>
          <p className="mt-1 text-[9px] tracking-[2px] text-gray-400">
            PERSONAL FINANCE
          </p>
        </div>
      </div>

      <p className="mb-4 px-2 text-[10px] tracking-[2px] text-gray-500">
        WORKSPACE
      </p>

      <nav className="flex flex-col gap-2">
        {menuItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => setActivePage(label)}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${
              activePage === label
                ? "bg-violet-600 text-white shadow-lg shadow-violet-950/30"
                : "text-gray-400 hover:bg-[#25253E] hover:text-white"
            }`}
          >
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={() => setActivePage("Settings")}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
            activePage === "Settings"
              ? "bg-violet-600 text-white"
              : "text-gray-400 hover:bg-[#25253E] hover:text-white"
          }`}
        >
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <div className="mt-6 rounded-xl border border-[#34344E] bg-[#202039] p-4">
          <Sparkles size={22} className="text-violet-400" />
          <h3 className="mt-3 text-sm font-semibold text-white">
            Smart Finance
          </h3>
          <p className="mt-2 text-xs leading-5 text-gray-400">
            Understand your spending better with AI insights.
          </p>
          <button
            type="button"
            onClick={() => setActivePage("AI Smart Entry")}
            className="mt-4 w-full rounded-lg bg-violet-600 py-2.5 text-xs font-medium text-white transition hover:bg-violet-700"
          >
            Explore AI
          </button>
        </div>
      </div>
    </aside>
  );
}
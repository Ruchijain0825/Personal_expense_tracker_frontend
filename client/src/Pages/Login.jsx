
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // LOGIN AND SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const email = formData.email.trim().toLowerCase();

      if (activeTab === "signup") {
        // REGISTER NEW USER
        await api.post("/api/auth/register", {
          name: formData.name.trim(),
          email,
          password: formData.password,
        });

        toast.success("Account created successfully! Please login.");

        // SWITCH TO LOGIN AFTER REGISTRATION
        setActiveTab("login");

        // KEEP EMAIL AND CLEAR OTHER FIELDS
        setFormData({
          name: "",
          email: email,
          password: "",
        });

        setShowPassword(false);

        return;
      }

      // LOGIN EXISTING USER
      await login(email, formData.password);

      toast.success("Welcome back!");

      // NAVIGATE ONLY AFTER SUCCESSFUL LOGIN
      navigate("/dashboard", { replace: true });

    } catch (error) {
      console.error(
        "AUTH ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }
  };

  // SWITCH LOGIN / SIGNUP
  const switchTab = (tab) => {
    setActiveTab(tab);

    setFormData({
      name: "",
      email: "",
      password: "",
    });

    setShowPassword(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f3ff] px-4 py-10">

      {/* BACKGROUND DECORATIONS */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-violet-200/60 md:grid-cols-2">

        {/* BRANDING SECTION */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700 p-10 text-white md:flex">

          <div className="absolute -right-20 top-20 h-64 w-64 rounded-full border-[35px] border-white/10" />

          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full border-[40px] border-white/10" />

          <div className="relative z-10">
            <div className="mb-12 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-2xl">
                Γé╣
              </div>

              <span className="text-xl font-bold tracking-wide">
                SpendWise
              </span>

            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Take control of
              <br />
              your money.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-violet-100">
              Track expenses, understand your spending habits,
              and make smarter financial decisions with one
              simple dashboard.
            </p>
          </div>

          <div className="relative z-10 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">

            <p className="text-sm leading-6 text-violet-50">
              "A better financial future starts with understanding
              where your money goes."
            </p>

            <p className="mt-4 text-xs font-semibold text-violet-200">
              YOUR MONEY. YOUR CONTROL.
            </p>

          </div>
        </div>

        {/* FORM SECTION */}
        <div className="p-7 sm:p-10 lg:p-12">

          <div className="mb-8 md:hidden">
            <div className="flex items-center gap-2 text-xl font-bold text-violet-700">

              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                Γé╣
              </span>

              SpendWise
            </div>
          </div>

          <div className="mb-8">

            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">
              {activeTab === "login" ? "Welcome back" : "Get started"}
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {activeTab === "login"
                ? "Sign in to your account"
                : "Create your account"}
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              {activeTab === "login"
                ? "Enter your details to continue."
                : "Start managing your finances today."}
            </p>

          </div>

          {/* LOGIN / SIGNUP TOGGLE */}
          <div className="mb-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1">

            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`rounded-lg py-3 text-sm font-semibold transition-all ${
                activeTab === "login"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Login
            </button>

            <button
              type="button"
              onClick={() => switchTab("signup")}
              className={`rounded-lg py-3 text-sm font-semibold transition-all ${
                activeTab === "signup"
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Create Account
            </button>

          </div>

          {/* AUTH FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME */}
            {activeTab === "signup" && (
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  autoComplete="name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />

              </div>
            )}

            {/* EMAIL */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />

            </div>

            {/* PASSWORD */}
            <div>

              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

              </div>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  minLength={8}
                  autoComplete={
                    activeTab === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-16 text-sm outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-violet-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>
            </div>

            {/* SIGNUP INFORMATION */}
            {activeTab === "signup" && (
              <p className="text-xs leading-5 text-slate-500">
                By creating an account, you agree to use SpendWise
                responsibly and keep your login credentials secure.
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : activeTab === "login"
                  ? "Sign In ΓåÆ"
                  : "Create Account ΓåÆ"}
            </button>

          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            Securely manage your personal finances.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Auth;

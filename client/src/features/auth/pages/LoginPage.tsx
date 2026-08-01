import { Link } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { cn } from "@/utils/cn";
import { useLoginPage } from "../hooks/useLoginPage";

const LoginPage = () => {
  const { form, state, query, actions } = useLoginPage();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
        <p className="text-gray-400 text-sm">
          Sign in to your account to continue
        </p>
      </div>

      {query.apiError && (
        <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
          {query.apiError}
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(actions.onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Email
          </label>
          <input
            {...form.register("email")}
            type="email"
            placeholder="you@example.com"
            className={cn(
              "w-full px-4 py-2.5 bg-gray-800 border rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
              form.errors.email ? "border-red-500" : "border-gray-700",
            )}
          />
          {form.errors.email && (
            <p className="mt-1.5 text-xs text-red-400">
              {form.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              {...form.register("password")}
              type={state.showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "w-full px-4 py-2.5 pr-11 bg-gray-800 border rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition",
                form.errors.password ? "border-red-500" : "border-gray-700",
              )}
            />
            <button
              type="button"
              onClick={() => state.setShowPassword(!state.showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
            >
              {state.showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {form.errors.password && (
            <p className="mt-1.5 text-xs text-red-400">
              {form.errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={actions.isPending}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-xl text-sm font-medium transition-colors mt-2"
        >
          {actions.isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn className="w-4 h-4" />
          )}
          {actions.isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

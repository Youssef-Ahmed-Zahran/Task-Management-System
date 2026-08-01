import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  ChevronRight,
  ChevronLeft,
  User,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useLogout } from "@/features/auth/api/auth.api";
import { cn } from "@/utils/cn";

const navItems = [
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const AppLayout = () => {
  const { user, clearUser } = useAuthStore();
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogout();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        clearUser();
        navigate("/login");
      },
    });
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300",
          // Mobile classes: either translated out or in. Always 64 width.
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full w-64",
          // Desktop classes: static, always translated in, width changes based on collapse state.
          "lg:static lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "lg:w-64",
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 flex-shrink-0 min-h-[73px]">
          <div
            className={cn(
              "flex items-center gap-2.5",
              isCollapsed && "lg:hidden",
            )}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <FolderKanban className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-white whitespace-nowrap">
              TaskBoard
            </span>
          </div>
          {/* Centered logo for collapsed desktop view */}
          {isCollapsed && (
            <div className="hidden lg:flex w-full justify-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <FolderKanban className="w-4 h-4 text-white" />
              </div>
            </div>
          )}

          {/* Close button for mobile */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-600/30"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                  isCollapsed ? "lg:justify-center" : "gap-3",
                )
              }
              title={isCollapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-all",
                  isCollapsed && "lg:hidden",
                )}
              >
                {label}
              </span>
              {!isCollapsed && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info & logout */}
        <div className="p-3 border-t border-gray-800">
          <div
            className={cn(
              "flex items-center rounded-xl bg-gray-800/50 mb-2 transition-all",
              isCollapsed ? "lg:p-2 lg:justify-center" : "gap-3 px-3 py-2.5",
              isCollapsed && "gap-3 px-3 py-2.5", // for mobile fallback
            )}
          >
            <div className="w-8 h-8 bg-indigo-600/20 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <div
              className={cn(
                "flex-1 min-w-0 transition-all",
                isCollapsed && "lg:hidden",
              )}
            >
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className={cn(
              "w-full flex items-center rounded-xl text-sm text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all",
              isCollapsed ? "lg:justify-center lg:p-2.5" : "gap-3 px-3 py-2.5",
              isCollapsed && "gap-3 px-3 py-2.5",
            )}
            title={isCollapsed ? "Log Out" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span
              className={cn("whitespace-nowrap", isCollapsed && "lg:hidden")}
            >
              {isPending ? "Logging out..." : "Log Out"}
            </span>
          </button>
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors z-50 shadow-sm"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-white">
                TaskBoard
              </span>
            </div>
          </div>
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700">
            <User className="w-4 h-4 text-gray-400" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

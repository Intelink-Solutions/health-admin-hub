import { UserCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import type { ReactNode } from "react";

interface PublicWideHeaderProps {
  extraAction?: ReactNode;
}

export function PublicWideHeader({ extraAction }: PublicWideHeaderProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const profilePath = user?.role === "provider" ? "/provider/dashboard" : "/user/dashboard";

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/home")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">BP</span>
          </div>
          <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">BesaPlus</span>
          <span className="text-base md:text-lg font-bold text-gray-900 dark:text-white sm:hidden">BP</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/discover/doctors"
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`
            }
          >
            Doctors
          </NavLink>
          <NavLink
            to="/discover/hospitals"
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`
            }
          >
            Hospitals
          </NavLink>
          <NavLink
            to="/marketplace/services"
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive
                  ? "text-gray-900 dark:text-white font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`
            }
          >
            Services
          </NavLink>
          <ThemeToggle />
          {extraAction}
          {isAuthenticated ? (
            <button
              onClick={() => navigate(profilePath)}
              className="p-2 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              title="Profile"
            >
              <UserCircle className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          {extraAction}
          {isAuthenticated ? (
            <button
              onClick={() => navigate(profilePath)}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 transition"
              title="Profile"
            >
              <UserCircle className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

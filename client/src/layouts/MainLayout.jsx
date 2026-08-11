import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Settings,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import vector1 from "../assets/vector1.png";
import vector2 from "../assets/vector2.png";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  useEffect(() => {
    const handleThemeChange = (event) => {
      setDarkMode(event.detail === "dark");
    };

    window.addEventListener("themeChanged", handleThemeChange);

    return () => {
      window.removeEventListener("themeChanged", handleThemeChange);
    };
  }, []);

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setShowNotifications(false);
  }, [location.pathname]);

  const enableLightMode = () => {
    setDarkMode(false);
  };

  const enableDarkMode = () => {
    setDarkMode(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    navigate(`/members?search=${encodeURIComponent(value)}`);
    setMobileMenuOpen(false);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const notifications = [
    {
      id: 1,
      title: "Attendance",
      message: "Check today's attendance records.",
    },
    {
      id: 2,
      title: "Upcoming Session",
      message: "Development Weekly Session is coming up.",
    },
  ];

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin", "supervisor", "user"],
    },
    {
      label: "All Members",
      path: "/members",
      icon: Users,
      roles: ["admin", "supervisor", "user"],
    },
    {
      label: "Attendance",
      path: "/attendance",
      icon: CalendarCheck,
      roles: ["admin", "supervisor"],
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
      roles: ["admin"],
    },
  ];

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";

    return "Good Evening";
  };

  const handleNavigation = () => {
    setMobileMenuOpen(false);
    setShowNotifications(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col justify-between
          border-r border-slate-200
          bg-white p-4
          shadow-2xl
          transition-transform duration-300 ease-out
          dark:border-slate-700
          dark:bg-slate-800
          lg:static
          lg:z-auto
          lg:w-64
          lg:translate-x-0
          lg:shadow-none
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="min-h-0">
          <div className="mb-7 flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-11 shrink-0 items-center justify-center">
                <img
                  src={vector1}
                  alt="Logo Icon Left"
                  className="absolute left-0 top-0 z-10 h-7 w-7 object-contain"
                />

                <img
                  src={vector2}
                  alt="Logo Icon Right"
                  className="absolute bottom-0 right-0 z-0 h-7 w-7 object-contain"
                />
              </div>

              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Logoipsum
              </span>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-1.5">
            {filteredNav.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavigation}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "border-l-4 border-blue-600 bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-blue-400"
                        : "border-l-4 border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />

                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-100 p-1 dark:bg-slate-700">
            <button
              type="button"
              onClick={enableLightMode}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                !darkMode
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={enableDarkMode}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all ${
                darkMode
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              }`}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="relative z-30 flex min-h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-800 sm:px-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-bold text-slate-900 dark:text-white sm:text-base lg:text-lg">
                Hello {user?.fullName?.split(" ")[0] || "User"} 👋
              </h1>

              <p className="text-[10px] text-slate-400 sm:text-xs">
                {getGreeting()}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 rounded-xl bg-slate-100 py-2 pl-9 pr-9 text-xs text-slate-800 outline-none transition focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white lg:w-64"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 flex -translate-y-1/2 items-center justify-center text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={() => navigate("/members")}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:text-blue-600 dark:bg-slate-700 dark:text-slate-300 md:hidden"
              aria-label="Search members"
            >
              <Search className="h-4 w-4" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:text-blue-600 dark:bg-slate-700 dark:text-slate-300"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />

                {notifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-12 z-50 w-[calc(100vw-1.5rem)] max-w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-700">
                    <h3 className="text-sm font-bold">Notifications</h3>

                    <button
                      type="button"
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="border-b border-slate-100 p-4 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700"
                      >
                        <p className="text-xs font-bold">
                          {notification.title}
                        </p>

                        <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                          {notification.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-l border-slate-200 pl-2 sm:gap-3 sm:pl-3 dark:border-slate-700 lg:pl-4">
              <img
                src={
                  user?.avatarUrl ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                }
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 sm:h-9 sm:w-9"
              />

              <div className="hidden text-left sm:block">
                <p className="max-w-32 truncate text-xs font-bold leading-tight lg:max-w-none">
                  {user?.fullName || "User"}
                </p>

                <p className="text-[10px] font-semibold uppercase text-slate-400">
                  {user?.role || "user"}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

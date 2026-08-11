import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, setUser } = useAuth();

  const [theme, setTheme] = useState(
    user?.settings?.theme || localStorage.getItem("theme") || "light",
  );

  const [autoAddEvents, setAutoAddEvents] = useState(
    user?.settings?.autoAddCalendarEvents ?? true,
  );

  const [phonePublic, setPhonePublic] = useState(
    user?.settings?.phonePublic ?? false,
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedTheme =
      user?.settings?.theme || localStorage.getItem("theme") || "light";

    setTheme(savedTheme);

    setAutoAddEvents(user?.settings?.autoAddCalendarEvents ?? true);

    setPhonePublic(user?.settings?.phonePublic ?? false);

    applyTheme(savedTheme);
  }, [user]);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", newTheme);

    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: newTheme,
      }),
    );
  };

  const updateSetting = async (key, value) => {
    if (!user) return false;

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const updatedSettings = {
        ...(user.settings || {}),
        [key]: value,
      };

      const res = await API.put("/settings", updatedSettings);

      const savedSettings = res.data?.settings || res.data;

      setUser({
        ...user,
        settings: savedSettings,
      });

      setMessage("Settings updated successfully.");

      setTimeout(() => {
        setMessage("");
      }, 2000);

      return true;
    } catch (err) {
      console.error("Failed to update settings:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update settings. Please try again.",
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = async (e) => {
    const newTheme = e.target.value;
    const previousTheme = theme;

    setTheme(newTheme);
    applyTheme(newTheme);

    const success = await updateSetting("theme", newTheme);

    if (!success) {
      setTheme(previousTheme);
      applyTheme(previousTheme);
    }
  };

  const handleAutoAddEvents = async () => {
    const newValue = !autoAddEvents;
    const previousValue = autoAddEvents;

    setAutoAddEvents(newValue);

    const success = await updateSetting("autoAddCalendarEvents", newValue);

    if (!success) {
      setAutoAddEvents(previousValue);
    }
  };

  const handlePhonePublic = async () => {
    const newValue = !phonePublic;
    const previousValue = phonePublic;

    setPhonePublic(newValue);

    const success = await updateSetting("phonePublic", newValue);

    if (!success) {
      setPhonePublic(previousValue);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-100 dark:border-slate-700 shadow-sm space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Settings
        </h2>

        <p className="text-sm text-slate-400 mt-1">
          Manage your account preferences and privacy settings.
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-sm rounded-xl px-4 py-3">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
        <div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">
            Appearance
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Customize how your application looks.
          </p>
        </div>

        <select
          value={theme}
          onChange={handleThemeChange}
          disabled={saving}
          className="w-full sm:w-auto border border-slate-200 dark:border-slate-700 text-xs rounded-xl px-3 py-2 font-semibold bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-xl">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">
            Automatically Add Events to Calendar
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Save time by automatically adding events to your calendar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoAddEvents}
          disabled={saving}
          aria-label="Automatically add events to calendar"
          aria-pressed={autoAddEvents}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
            autoAddEvents ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
          } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              autoAddEvents ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="max-w-xl">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">
            Make Your Phone Public
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Allow other users to see your phone number.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePhonePublic}
          disabled={saving}
          aria-label="Make phone number public"
          aria-pressed={phonePublic}
          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
            phonePublic ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
          } ${saving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              phonePublic ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

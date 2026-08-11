import React, { useEffect, useMemo, useState } from "react";
import calendarImage from "../assets/calendar.png";
import API from "../services/api";
import {
  Users,
  Layers,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalDivisions: 0,
    attendanceRate: "0%",
    upcomingSessions: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [error, setError] = useState("");
  const [sessionForm, setSessionForm] = useState({
    title: "",
    division: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
  });

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const loadStats = async () => {
    try {
      const response = await API.get("/dashboard/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
      setError("Failed to load dashboard statistics.");
    }
  };

  const loadChart = async () => {
    try {
      const response = await API.get("/dashboard/attendance-overview");
      setChartData(response.data);
    } catch (error) {
      console.error("Failed to load attendance overview:", error);
    }
  };

  const loadSessions = async (date = calendarMonth) => {
    try {
      setSessionLoading(true);

      const month = date.getMonth();
      const year = date.getFullYear();

      const response = await API.get(
        `/dashboard/sessions?month=${month}&year=${year}`,
      );

      setSessions(response.data);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      setError("Failed to load sessions.");
    } finally {
      setSessionLoading(false);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      await Promise.all([
        loadStats(),
        loadChart(),
        loadSessions(calendarMonth),
      ]);

      setLoading(false);
    };

    loadDashboard();
  }, []);

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [calendarMonth]);

  const selectedDateSessions = useMemo(() => {
    const selected = formatDate(selectedDate);

    return sessions.filter(
      (session) => formatDate(new Date(session.date)) === selected,
    );
  }, [sessions, selectedDate]);

  const sessionDates = useMemo(() => {
    return new Set(
      sessions.map((session) => formatDate(new Date(session.date))),
    );
  }, [sessions]);

  const handlePreviousMonth = async () => {
    const newMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() - 1,
      1,
    );

    setCalendarMonth(newMonth);
    await loadSessions(newMonth);
  };

  const handleNextMonth = async () => {
    const newMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      1,
    );

    setCalendarMonth(newMonth);
    await loadSessions(newMonth);
  };

  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  const handleAddSession = async (e) => {
    e.preventDefault();

    try {
      await API.post("/dashboard/sessions", sessionForm);

      alert("Session created successfully!");

      setShowAddSession(false);

      setSessionForm({
        title: "",
        division: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        location: "",
      });

      await loadSessions(calendarMonth);
      await loadStats();
    } catch (error) {
      console.error("Failed to create session:", error);
      alert(error.response?.data?.message || "Failed to create session.");
    }
  };

  const handleDeleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) {
      return;
    }

    try {
      await API.delete(`/dashboard/sessions/${id}`);

      await loadSessions(calendarMonth);
      await loadStats();

      alert("Session deleted successfully.");
    } catch (error) {
      console.error("Failed to delete session:", error);
      alert(error.response?.data?.message || "Failed to delete session.");
    }
  };

  const handleAddToCalendar = (session) => {
    const startDate = new Date(session.date);

    const [startHour, startMinute] = session.startTime.split(":").map(Number);

    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(startDate);

    if (session.endTime) {
      const [endHour, endMinute] = session.endTime.split(":").map(Number);

      endDate.setHours(endHour, endMinute, 0, 0);
    } else {
      endDate.setHours(startDate.getHours() + 1);
    }

    const formatGoogleDate = (date) => {
      return date
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    };

    const url =
      `https://calendar.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(session.title)}` +
      `&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}` +
      `&details=${encodeURIComponent(session.description || "")}` +
      `&location=${encodeURIComponent(session.location || "")}`;

    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center sm:min-h-[400px]">
        <p className="text-sm text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        <div className="min-w-0 space-y-4 lg:col-span-8 lg:space-y-6">
          <div className="relative flex min-h-[180px] items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-5 text-white shadow-sm sm:min-h-[200px] sm:p-6">
            <div className="relative z-10 max-w-[65%] sm:max-w-none">
              <span className="rounded-full bg-red-400/80 px-2 py-0.5 text-[9px] font-bold uppercase sm:text-[10px]">
                Members
              </span>

              <h2 className="mt-2 text-lg font-bold sm:text-xl">
                Upcoming Event
              </h2>

              <p className="mt-1 text-xs opacity-90 sm:text-sm">
                Cross-division knowledge-sharing
              </p>

              <button
                type="button"
                className="mt-4 rounded-xl bg-blue-900 px-3 py-2 text-[10px] font-semibold shadow sm:px-4 sm:text-xs"
              >
                Add to calendar
              </button>
            </div>

            <div className="absolute right-1 top-1/2 -translate-y-1/2 sm:right-3 md:right-6">
              <img
                src={calendarImage}
                alt="Upcoming event calendar"
                className="h-24 w-24 rounded-[10px] object-contain sm:h-32 sm:w-32"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-[11px] font-semibold sm:text-xs">
                  <Users className="h-4 w-4" />
                  Total Members
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">{stats.totalMembers}</span>
              </div>

              <p className="mt-2 text-[10px] text-slate-400">
                Current registered members
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-[11px] font-semibold sm:text-xs">
                  <Layers className="h-4 w-4" />
                  Total Divisions
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {stats.totalDivisions}
                </span>
              </div>

              <p className="mt-2 text-[10px] text-slate-400">
                Active member divisions
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-[11px] font-semibold sm:text-xs">
                  <Calendar className="h-4 w-4" />
                  Attendance Rate
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {stats.attendanceRate}
                </span>
              </div>

              <p className="mt-2 text-[10px] text-slate-400">
                Based on recorded attendance
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1 text-[11px] font-semibold sm:text-xs">
                  <Clock className="h-4 w-4" />
                  Upcoming Sessions
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {stats.upcomingSessions}
                </span>
              </div>

              <p className="mt-2 text-[10px] text-slate-400">
                Scheduled future sessions
              </p>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-bold">Attendance Overview</h3>

              <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 sm:gap-4 sm:text-xs">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-800" />
                  This year
                </span>

                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  Last year
                </span>
              </div>
            </div>

            <div className="h-48 w-full min-w-0 sm:h-56">
              {chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-xs text-slate-400">
                  No attendance data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} />

                    <YAxis
                      domain={[0, 100]}
                      stroke="#94a3b8"
                      fontSize={10}
                      width={30}
                    />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="thisYear"
                      stroke="#1e293b"
                      fill="#f1f5f9"
                    />

                    <Area
                      type="monotone"
                      dataKey="lastYear"
                      stroke="#cbd5e1"
                      strokeDasharray="3 3"
                      fill="none"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-6 lg:col-span-4">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-bold">Session</h3>

            {(user?.role === "admin" || user?.role === "supervisor") && (
              <button
                type="button"
                onClick={() => setShowAddSession(true)}
                className="flex items-center gap-1 rounded-xl bg-blue-900 px-3 py-2 text-xs text-white transition hover:bg-blue-800"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            )}
          </div>

          <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white transition hover:bg-blue-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="text-xs font-bold sm:text-sm">
                {calendarMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-900 text-white transition hover:bg-blue-800"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-slate-400 sm:text-[10px]">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
              {calendarDays.map((date, index) => {
                if (!date) {
                  return <span key={index} className="h-8" />;
                }

                const dateKey = formatDate(date);
                const isSelected = formatDate(selectedDate) === dateKey;
                const isToday = formatDate(new Date()) === dateKey;
                const hasSession = sessionDates.has(dateKey);

                return (
                  <button
                    type="button"
                    key={dateKey}
                    onClick={() => handleSelectDate(date)}
                    className={`relative h-8 rounded-full text-[10px] transition sm:text-xs ${
                      isSelected
                        ? "bg-blue-900 text-white"
                        : isToday
                          ? "border border-blue-900 text-blue-900"
                          : "hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {date.getDate()}

                    {hasSession && (
                      <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5">
            <p className="mb-4 text-xs font-bold text-slate-400">
              {formatDisplayDate(selectedDate)}
            </p>

            {sessionLoading ? (
              <p className="text-xs text-slate-400">Loading sessions...</p>
            ) : selectedDateSessions.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                No sessions scheduled.
              </div>
            ) : (
              <div className="space-y-3 border-l-2 border-slate-100 pl-3 text-xs dark:border-slate-700">
                {selectedDateSessions.map((session) => (
                  <div key={session._id} className="min-w-0">
                    <p className="break-words font-bold text-slate-400">
                      {session.startTime}
                      {session.endTime ? ` — ${session.endTime}` : ""} —{" "}
                      {session.division}
                    </p>

                    <p className="mt-1 break-words font-bold">
                      {session.title}
                    </p>

                    {session.description && (
                      <p className="mt-1 break-words text-slate-400">
                        {session.description}
                      </p>
                    )}

                    {session.location && (
                      <p className="mt-1 break-words text-slate-400">
                        📍 {session.location}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCalendar(session)}
                        className="rounded-lg bg-blue-900 px-2 py-1 text-[10px] text-white"
                      >
                        Add to calendar
                      </button>

                      {(user?.role === "admin" ||
                        user?.role === "supervisor") && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(session._id)}
                          className="rounded-lg p-1 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-slate-700"
                          aria-label="Delete session"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-3 sm:p-4">
          <div className="my-auto max-h-[95vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl dark:bg-slate-800 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-bold">Add Session</h3>

              <button
                type="button"
                onClick={() => setShowAddSession(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleAddSession}
              className="space-y-3 sm:space-y-4"
            >
              <input
                required
                type="text"
                placeholder="Session title"
                value={sessionForm.title}
                onChange={(e) =>
                  setSessionForm({
                    ...sessionForm,
                    title: e.target.value,
                  })
                }
                className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
              />

              <input
                required
                type="text"
                placeholder="Division"
                value={sessionForm.division}
                onChange={(e) =>
                  setSessionForm({
                    ...sessionForm,
                    division: e.target.value,
                  })
                }
                className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
              />

              <textarea
                placeholder="Description"
                value={sessionForm.description}
                onChange={(e) =>
                  setSessionForm({
                    ...sessionForm,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full resize-none rounded-xl bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
              />

              <input
                required
                type="date"
                value={sessionForm.date}
                onChange={(e) =>
                  setSessionForm({
                    ...sessionForm,
                    date: e.target.value,
                  })
                }
                className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
              />

              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                <input
                  required
                  type="time"
                  value={sessionForm.startTime}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      startTime: e.target.value,
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
                />

                <input
                  type="time"
                  value={sessionForm.endTime}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      endTime: e.target.value,
                    })
                  }
                  className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
                />
              </div>

              <input
                type="text"
                placeholder="Location"
                value={sessionForm.location}
                onChange={(e) =>
                  setSessionForm({
                    ...sessionForm,
                    location: e.target.value,
                  })
                }
                className="w-full rounded-xl bg-slate-50 px-3 py-2.5 text-xs outline-none transition focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-900 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-800"
              >
                Create Session
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

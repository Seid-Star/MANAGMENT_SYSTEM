import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Search, Filter, X, CheckCircle, AlertCircle } from "lucide-react";

export default function Attendance() {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const GROUP = "Group 1";

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const TODAY = getToday();

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);

        const [membersResponse, attendanceResponse] = await Promise.all([
          API.get("/members?limit=1000"),
          API.get(
            `/attendance?group=${encodeURIComponent(GROUP)}&date=${TODAY}`,
          ),
        ]);

        const memberList = membersResponse.data.data || [];
        const attendanceList = attendanceResponse.data || [];

        setMembers(memberList);

        const attendanceMap = {};

        memberList.forEach((member) => {
          attendanceMap[member._id] = {
            status: "Present",
            excused: false,
            excuseReason: "",
            recordId: null,
          };
        });

        attendanceList.forEach((record) => {
          if (!record.member) return;

          const memberId =
            typeof record.member === "object"
              ? record.member._id
              : record.member;

          attendanceMap[memberId] = {
            status: record.status,
            excused: record.excused || false,
            excuseReason: record.excuseReason || "",
            recordId: record._id,
          };
        });

        setAttendance(attendanceMap);
      } catch (error) {
        console.error("Failed to load attendance:", error);

        alert(error.response?.data?.message || "Failed to load attendance.");
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, []);

  const handleToggleStatus = (memberId, status) => {
    if (user?.role === "user") return;

    setAttendance((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        status,
        excused:
          status === "Present" ? false : prev[memberId]?.excused || false,
        excuseReason:
          status === "Present" ? "" : prev[memberId]?.excuseReason || "",
      },
    }));
  };

  const handleHeadsUp = (memberId) => {
    if (user?.role === "user") return;

    const current = attendance[memberId];

    if (current?.status !== "Absent") {
      alert("Heads Up can only be used for an absent member.");
      return;
    }

    setAttendance((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        excused: !prev[memberId]?.excused,
      },
    }));
  };

  const handleSave = async () => {
    if (user?.role !== "admin" && user?.role !== "supervisor") {
      return;
    }

    try {
      setSaving(true);

      const records = Object.entries(attendance).map(([memberId, record]) => ({
        memberId,
        status: record.status,
        excused: record.excused,
        excuseReason: record.excuseReason || "",
      }));

      await API.post("/attendance", {
        group: GROUP,
        date: TODAY,
        records,
      });

      alert("Attendance saved successfully!");

      const response = await API.get(
        `/attendance?group=${encodeURIComponent(GROUP)}&date=${TODAY}`,
      );

      const updatedMap = {};

      members.forEach((member) => {
        updatedMap[member._id] = {
          status: "Present",
          excused: false,
          excuseReason: "",
          recordId: null,
        };
      });

      response.data.forEach((record) => {
        if (!record.member) return;

        const memberId =
          typeof record.member === "object" ? record.member._id : record.member;

        updatedMap[memberId] = {
          status: record.status,
          excused: record.excused || false,
          excuseReason: record.excuseReason || "",
          recordId: record._id,
        };
      });

      setAttendance(updatedMap);
    } catch (error) {
      console.error("Failed to save attendance:", error);

      alert(error.response?.data?.message || "Failed to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  const filteredMembers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !searchValue ||
        member.name?.toLowerCase().includes(searchValue) ||
        member.memberId?.toLowerCase().includes(searchValue) ||
        member.division?.toLowerCase().includes(searchValue);

      const memberStatus = attendance[member._id]?.status;

      const matchesFilter = filter === "All" || memberStatus === filter;

      return matchesSearch && matchesFilter;
    });
  }, [members, attendance, search, filter]);

  const clearFilters = () => {
    setSearch("");
    setFilter("All");
  };

  const presentCount = members.filter(
    (member) => attendance[member._id]?.status === "Present",
  ).length;

  const absentCount = members.filter(
    (member) => attendance[member._id]?.status === "Absent",
  ).length;

  const excusedCount = members.filter(
    (member) => attendance[member._id]?.excused === true,
  ).length;

  return (
    <div className="min-w-0 space-y-5 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:space-y-6 sm:p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl bg-slate-50 py-2.5 pl-9 pr-9 text-xs outline-none transition focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            {(user?.role === "admin" || user?.role === "supervisor") && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || loading}
                className="rounded-xl bg-blue-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (filter === "All") {
                  setFilter("Present");
                } else if (filter === "Present") {
                  setFilter("Absent");
                } else {
                  setFilter("All");
                }
              }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold dark:border-slate-700"
            >
              <Filter className="h-4 w-4" />

              {filter === "All" ? "Filter" : filter}
            </button>

            {(search || filter !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="col-span-2 flex items-center justify-center gap-1 text-xs text-slate-500 transition hover:text-rose-600 sm:col-span-1"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-600">
            <CheckCircle className="h-4 w-4 shrink-0" />
            <span>Present: {presentCount}</span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-semibold text-rose-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Absent: {absentCount}</span>
          </div>

          <div className="rounded-xl bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-600">
            Excused: {excusedCount}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-700">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Loading attendance...
          </div>
        ) : (
          <table className="w-full min-w-[620px] text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr className="border-b border-slate-100 text-slate-400 dark:border-slate-700">
                <th className="px-3 py-3 font-semibold sm:px-4">Member Name</th>

                <th className="px-3 py-3 text-center font-semibold sm:px-4">
                  Attendance
                </th>

                <th className="px-3 py-3 text-right font-semibold sm:px-4">
                  Heads Up
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    No members found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const current = attendance[member._id];

                  return (
                    <tr
                      key={member._id}
                      className="transition hover:bg-slate-50 dark:hover:bg-slate-700/40"
                    >
                      <td className="px-3 py-3.5 sm:px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={
                              member.avatarUrl ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                            }
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                          />

                          <div className="min-w-0">
                            <span className="block truncate font-bold">
                              {member.name}
                            </span>

                            <p className="truncate text-[10px] text-slate-400">
                              {member.memberId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-3.5 text-center sm:px-4">
                        <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-600 dark:bg-slate-700">
                          <button
                            type="button"
                            disabled={user?.role === "user"}
                            onClick={() =>
                              handleToggleStatus(member._id, "Present")
                            }
                            className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:px-4 ${
                              current?.status === "Present"
                                ? "bg-white text-emerald-600 shadow-sm dark:bg-slate-800"
                                : "text-slate-400"
                            } ${
                              user?.role === "user"
                                ? "cursor-not-allowed"
                                : "hover:text-emerald-600"
                            }`}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            disabled={user?.role === "user"}
                            onClick={() =>
                              handleToggleStatus(member._id, "Absent")
                            }
                            className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition sm:px-4 ${
                              current?.status === "Absent"
                                ? "bg-white text-rose-600 shadow-sm dark:bg-slate-800"
                                : "text-slate-400"
                            } ${
                              user?.role === "user"
                                ? "cursor-not-allowed"
                                : "hover:text-rose-600"
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>

                      <td className="px-3 py-3.5 text-right sm:px-4">
                        <button
                          type="button"
                          disabled={
                            user?.role === "user" ||
                            current?.status !== "Absent"
                          }
                          onClick={() => handleHeadsUp(member._id)}
                          className={`rounded-xl px-3 py-1.5 text-[10px] font-semibold transition sm:px-4 ${
                            current?.excused
                              ? "bg-emerald-600 text-white"
                              : "bg-blue-900 text-white"
                          } ${
                            user?.role === "user" ||
                            current?.status !== "Absent"
                              ? "cursor-not-allowed opacity-40"
                              : "hover:bg-blue-800"
                          }`}
                        >
                          {current?.excused ? "Excused" : "Heads Up"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {!loading && filteredMembers.length > 0 && (
        <div className="flex flex-col gap-1 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>
            Showing {filteredMembers.length} of {members.length} members
          </span>

          <span>{TODAY}</span>
        </div>
      )}
    </div>
  );
}

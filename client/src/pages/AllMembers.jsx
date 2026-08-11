import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Search, Filter, Pencil, Trash2, Plus, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function AllMembers() {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  const [formData, setFormData] = useState({
    name: "",
    avatarUrl: "",
    memberId: "",
    division: "",
    attendanceStatus: "Active",
    year: "",
    campusStatus: "On Campus",
  });

  const [editingMemberId, setEditingMemberId] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);

        const res = await API.get(
          `/members?search=${encodeURIComponent(search)}`,
        );

        setMembers(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [search]);

  const resetForm = () => {
    setFormData({
      name: "",
      avatarUrl: "",
      memberId: "",
      division: "",
      attendanceStatus: "Active",
      year: "",
      campusStatus: "On Campus",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/members", formData);

      setMembers((prev) => [res.data, ...prev]);

      resetForm();
      setShowAddModal(false);

      alert("Member added successfully!");
    } catch (error) {
      console.error("Error adding member:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add member. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (member) => {
    setEditingMemberId(member._id);

    setFormData({
      name: member.name || "",
      avatarUrl: member.avatarUrl || "",
      memberId: member.memberId || "",
      division: member.division || "",
      attendanceStatus: member.attendanceStatus || "Active",
      year: member.year || "",
      campusStatus: member.campusStatus || "On Campus",
    });

    setShowEditModal(true);
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();

    if (!editingMemberId) return;

    try {
      setLoading(true);

      const res = await API.put(`/members/${editingMemberId}`, formData);

      setMembers((prev) =>
        prev.map((member) =>
          member._id === editingMemberId ? res.data : member,
        ),
      );

      resetForm();
      setEditingMemberId(null);
      setShowEditModal(false);

      alert("Member updated successfully!");
    } catch (error) {
      console.error("Error updating member:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update member. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    try {
      setLoading(true);

      await API.delete(`/members/${id}`);

      setMembers((prev) => prev.filter((member) => member._id !== id));

      alert("Member deleted successfully!");
    } catch (error) {
      console.error("Error deleting member:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete member. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingMemberId(null);
    resetForm();
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-5 sm:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-700 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {user?.role === "admin" && (
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="flex items-center justify-center gap-1.5 bg-blue-900 text-white text-xs px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-800 transition flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          )}

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 text-xs px-3 py-2.5 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
        {loading && members.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No members found.
          </div>
        ) : (
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <th className="pb-3 font-semibold">Member Name</th>
                <th className="pb-3 font-semibold">Member ID</th>
                <th className="pb-3 font-semibold">Division</th>
                <th className="pb-3 font-semibold">Attendance</th>
                <th className="pb-3 font-semibold">Year</th>
                <th className="pb-3 font-semibold">Status</th>

                {user?.role === "admin" && (
                  <th className="pb-3 font-semibold">Action</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {members.map((member) => (
                <tr
                  key={member._id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition"
                >
                  <td className="py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={
                          member.avatarUrl ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                        }
                        alt={member.name || "Member"}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />

                      <div className="min-w-0">
                        <span className="font-bold block truncate max-w-[180px]">
                          {member.name}
                        </span>

                        <span className="text-[10px] text-slate-400">
                          {member.division || "No division"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 text-slate-500">{member.memberId}</td>

                  <td className="py-3.5 font-medium">{member.division}</td>

                  <td className="py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full font-semibold text-[10px] ${
                        member.attendanceStatus === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : member.attendanceStatus === "Needs Attention"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {member.attendanceStatus}
                    </span>
                  </td>

                  <td className="py-3.5">{member.year}</td>

                  <td className="py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full font-semibold text-[10px] ${
                        member.campusStatus === "On Campus"
                          ? "bg-emerald-50 text-emerald-600"
                          : member.campusStatus === "Off Campus"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {member.campusStatus}
                    </span>
                  </td>

                  {user?.role === "admin" && (
                    <td className="py-3.5">
                      <div className="flex items-center gap-3 text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleEditClick(member)}
                          className="hover:text-blue-600 transition"
                          title="Edit member"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(member._id)}
                          className="hover:text-rose-600 transition"
                          title="Delete member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
          <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                  {showEditModal ? "Edit Member" : "Add Member"}
                </h2>

                <p className="text-xs text-slate-400 mt-1">
                  {showEditModal
                    ? "Update member information."
                    : "Create a new member account."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={showEditModal ? handleUpdateMember : handleAddMember}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Member Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter member name"
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Member ID
                </label>

                <input
                  type="text"
                  name="memberId"
                  value={formData.memberId}
                  onChange={handleChange}
                  placeholder="e.g. ASTU001"
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Division
                </label>

                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleChange}
                  placeholder="Enter division"
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Year
                  </label>

                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select year</option>
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Attendance
                  </label>

                  <select
                    name="attendanceStatus"
                    value={formData.attendanceStatus}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Needs Attention">Needs Attention</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Campus Status
                </label>

                <select
                  name="campusStatus"
                  value={formData.campusStatus}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="On Campus">On Campus</option>
                  <option value="Off Campus">Off Campus</option>
                  <option value="Withdrawn">Withdrawn</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Avatar URL
                </label>

                <input
                  type="url"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto rounded-xl bg-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 transition"
                >
                  {loading
                    ? showEditModal
                      ? "Updating..."
                      : "Adding..."
                    : showEditModal
                      ? "Update Member"
                      : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    memberId: { type: String, required: true, unique: true },
    division: { type: String, required: true },
    attendanceStatus: {
      type: String,
      enum: ["Active", "Needs Attention", "Inactive"],
      default: "Active",
    },
    year: { type: String, required: true },
    campusStatus: {
      type: String,
      enum: ["On Campus", "Off Campus", "Withdrawn"],
      default: "On Campus",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Member", memberSchema);

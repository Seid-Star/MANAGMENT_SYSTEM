const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },

    excused: {
      type: Boolean,
      default: false,
    },

    excuseReason: {
      type: String,
      default: "",
    },

    group: {
      type: String,
      default: "Group 1",
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// One attendance record per member per group per day
attendanceSchema.index({ member: 1, group: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);

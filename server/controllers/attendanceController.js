const Attendance = require("../models/Attendance");

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res, next) => {
  try {
    const group = req.query.group || "Group 1";

    const dateParam = req.query.date ? new Date(req.query.date) : new Date();

    if (isNaN(dateParam.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // Start of selected day
    const startOfDay = new Date(dateParam);
    startOfDay.setHours(0, 0, 0, 0);

    // End of selected day
    const endOfDay = new Date(dateParam);
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceRecords = await Attendance.find({
      group,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("member")
      .populate("markedBy", "fullName email")
      .sort({ createdAt: -1 });

    res.json(attendanceRecords);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Admin/Supervisor
exports.markAttendance = async (req, res, next) => {
  try {
    const { records, group = "Group 1", date } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        message: "Attendance records are required",
      });
    }

    const targetDate = date ? new Date(date) : new Date();

    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    // Normalize to beginning of day
    targetDate.setHours(0, 0, 0, 0);

    const bulkOps = records.map((record) => ({
      updateOne: {
        filter: {
          member: record.memberId,
          group,
          date: targetDate,
        },

        update: {
          $set: {
            status: record.status,
            excused: record.excused || false,
            excuseReason: record.excuseReason || "",
            markedBy: req.user._id,
          },

          $setOnInsert: {
            member: record.memberId,
            group,
            date: targetDate,
          },
        },

        upsert: true,
      },
    }));

    await Attendance.bulkWrite(bulkOps);

    res.json({
      message: "Attendance recorded successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update attendance record
// @route   PUT /api/attendance/:id
// @access  Admin/Supervisor
exports.updateAttendance = async (req, res, next) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("member")
      .populate("markedBy", "fullName email");

    if (!record) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    res.json(record);
  } catch (error) {
    next(error);
  }
};

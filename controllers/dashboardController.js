const Member = require("../models/Member");
const Attendance = require("../models/Attendance");
const Session = require("../models/Session");

// =====================================================
// GET DASHBOARD STATS
// GET /api/dashboard/stats
// =====================================================

exports.getStats = async (req, res, next) => {
  try {
    // Total members
    const totalMembers = await Member.countDocuments();

    // Total divisions
    const divisions = await Member.distinct("division");

    // Attendance statistics
    const totalAttendance = await Attendance.countDocuments();

    const presentAttendance = await Attendance.countDocuments({
      status: "Present",
    });

    const attendanceRate =
      totalAttendance > 0
        ? Math.round((presentAttendance / totalAttendance) * 100)
        : 0;

    // Upcoming sessions
    const now = new Date();

    const upcomingSessions = await Session.countDocuments({
      date: {
        $gte: now,
      },
    });

    res.json({
      totalMembers,
      totalDivisions: divisions.length,
      attendanceRate: `${attendanceRate}%`,
      upcomingSessions,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// ATTENDANCE OVERVIEW
// GET /api/dashboard/attendance-overview
// =====================================================

exports.getAttendanceOverview = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const chartData = [];

    for (let month = 0; month < 12; month++) {
      // Current year
      const currentStart = new Date(currentYear, month, 1);

      const currentEnd = new Date(currentYear, month + 1, 1);

      // Previous year
      const previousStart = new Date(previousYear, month, 1);

      const previousEnd = new Date(previousYear, month + 1, 1);

      // Current year attendance
      const currentTotal = await Attendance.countDocuments({
        date: {
          $gte: currentStart,
          $lt: currentEnd,
        },
      });

      const currentPresent = await Attendance.countDocuments({
        date: {
          $gte: currentStart,
          $lt: currentEnd,
        },
        status: "Present",
      });

      // Previous year attendance
      const previousTotal = await Attendance.countDocuments({
        date: {
          $gte: previousStart,
          $lt: previousEnd,
        },
      });

      const previousPresent = await Attendance.countDocuments({
        date: {
          $gte: previousStart,
          $lt: previousEnd,
        },
        status: "Present",
      });

      const thisYear =
        currentTotal > 0
          ? Math.round((currentPresent / currentTotal) * 100)
          : 0;

      const lastYear =
        previousTotal > 0
          ? Math.round((previousPresent / previousTotal) * 100)
          : 0;

      chartData.push({
        month: months[month],
        thisYear,
        lastYear,
      });
    }

    res.json(chartData);
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET SESSIONS
// GET /api/dashboard/sessions
// =====================================================

exports.getSessions = async (req, res, next) => {
  try {
    const { date, month, year } = req.query;

    const query = {};

    // Specific date
    if (date) {
      const selectedDate = new Date(date);

      if (isNaN(selectedDate.getTime())) {
        return res.status(400).json({
          message: "Invalid date",
        });
      }

      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // Specific month
    else if (month !== undefined && year) {
      const monthNumber = parseInt(month, 10);
      const yearNumber = parseInt(year, 10);

      const start = new Date(yearNumber, monthNumber, 1);

      const end = new Date(yearNumber, monthNumber + 1, 1);

      query.date = {
        $gte: start,
        $lt: end,
      };
    }

    const sessions = await Session.find(query)
      .populate("createdBy", "fullName email")
      .sort({
        date: 1,
        startTime: 1,
      });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// =====================================================
// CREATE SESSION
// POST /api/dashboard/sessions
// =====================================================

exports.createSession = async (req, res, next) => {
  try {
    const { title, division, description, date, startTime, endTime, location } =
      req.body;

    if (!title || !division || !date || !startTime) {
      return res.status(400).json({
        message: "Title, division, date and start time are required",
      });
    }

    const session = await Session.create({
      title,
      division,
      description,
      date,
      startTime,
      endTime,
      location,
      createdBy: req.user._id,
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE SESSION
// PUT /api/dashboard/sessions/:id
// =====================================================

exports.updateSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE SESSION
// DELETE /api/dashboard/sessions/:id
// =====================================================

exports.deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    res.json({
      message: "Session deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

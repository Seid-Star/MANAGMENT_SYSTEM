const express = require("express");

const {
  getStats,
  getAttendanceOverview,
  getSessions,
  createSession,
  updateSession,
  deleteSession,
} = require("../controllers/dashboardController");

const { protect } = require("../middleware/authMiddleware");

const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

// Dashboard statistics
router.get("/stats", getStats);

// Attendance chart
router.get("/attendance-overview", getAttendanceOverview);

// Sessions
router.get("/sessions", getSessions);

// Only admin and supervisor can manage sessions
router.post("/sessions", authorize("admin", "supervisor"), createSession);

router.put("/sessions/:id", authorize("admin", "supervisor"), updateSession);

router.delete("/sessions/:id", authorize("admin", "supervisor"), deleteSession);

module.exports = router;

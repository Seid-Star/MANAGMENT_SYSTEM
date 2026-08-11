const express = require("express");

const {
  getAttendance,
  markAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// Every attendance route requires login
router.use(protect);

// Admin, supervisor and user can view
router.get("/", getAttendance);

// Only admin and supervisor can save
router.post("/", authorize("admin", "supervisor"), markAttendance);

// Only admin and supervisor can update
router.put("/:id", authorize("admin", "supervisor"), updateAttendance);

module.exports = router;

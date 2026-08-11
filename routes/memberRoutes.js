const express = require("express");
const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getMembers);
router.get("/:id", getMemberById);
router.post("/", authorize("admin"), createMember);
router.put("/:id", authorize("admin"), updateMember);
router.delete("/:id", authorize("admin"), deleteMember);

module.exports = router;

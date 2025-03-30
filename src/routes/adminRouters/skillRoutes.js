const express = require("express");
const skillRouter = express.Router();
const { authenticateToken, authorizeRoles } = require("../../middleware/authMiddleware");
const skillController = require("../../controllers/adminControllers/skillController");

// ✅ Get all skills (Admin only)
skillRouter.get("/getAllSkills", authenticateToken, authorizeRoles("Admin"), skillController.getAllSkills);

// ✅ Get a single skill by ID (Admin only)
skillRouter.get("/getSkill/:ID", authenticateToken, authorizeRoles("Admin"), skillController.getSkillById);

// ✅ Create a new skill (Admin only)
skillRouter.post("/createSkill", authenticateToken, authorizeRoles("Admin"), skillController.createSkill);

// ✅ Update a skill (Admin only)
skillRouter.put("/updateSkill/:ID", authenticateToken, authorizeRoles("Admin"), skillController.updateSkill);

// ✅ Delete a skill (Admin only)
skillRouter.delete("/deleteSkill/:ID", authenticateToken, authorizeRoles("Admin"), skillController.deleteSkill);

module.exports = skillRouter;

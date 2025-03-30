const express = require("express");
const departmentRouter = express.Router();
const { authenticateToken, authorizeRoles } = require("../../middleware/authMiddleware");
const departmentController = require("../../controllers/adminControllers/departmentController");


// ✅ Get all departments (Admin only)
departmentRouter.get("/getAllDepartments", authenticateToken, authorizeRoles("Admin"), departmentController.getAllDepartments);

// ✅ Create a new department (Admin only)
departmentRouter.post("/createDepartment", authenticateToken, authorizeRoles("Admin"), departmentController.createDepartment);

// ✅ Update an existing department (Admin only)
departmentRouter.put("/updateDepartment/:ID", authenticateToken, authorizeRoles("Admin"), departmentController.updateDepartment);

// ✅ Delete a department (Admin only)
departmentRouter.delete("/deleteDepartment/:ID", authenticateToken, authorizeRoles("Admin"), departmentController.deleteDepartment);

module.exports = departmentRouter;

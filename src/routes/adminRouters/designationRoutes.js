const express = require("express");
const designationRouter = express.Router();
const { authenticateToken, authorizeRoles } = require("../../middleware/authMiddleware");
const designationController = require("../../controllers/adminControllers/designationController");

// ✅ Get all designations (Admin only)
designationRouter.get("/getAllDesignations", authenticateToken, authorizeRoles("Admin"), designationController.getAllDesignations);

// ✅ Get a single designation by ID (Admin only)
designationRouter.get("/get/:ID", authenticateToken, authorizeRoles("Admin"), designationController.getDesignationById);

// ✅ Create a new designation (Admin only)
designationRouter.post("/createDesignation", authenticateToken, authorizeRoles("Admin"), designationController.createDesignation);

// ✅ Update an existing designation (Admin only)
designationRouter.put("/updateDesignation/:ID", authenticateToken, authorizeRoles("Admin"), designationController.updateDesignation);

// ✅ Delete a designation (Admin only)
designationRouter.delete("/deleteDesignation/:ID", authenticateToken, authorizeRoles("Admin"), designationController.deleteDesignation);

module.exports = designationRouter;

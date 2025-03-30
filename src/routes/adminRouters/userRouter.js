const express = require("express");
const userRouter = express.Router();
const { authenticateToken, authorizeRoles } = require("../../middleware/authMiddleware");
const userController = require("../../controllers/adminControllers/userController");

// ✅ Only Admin can access this route
userRouter.get("/admin", authenticateToken, authorizeRoles("Admin"), userController.adminAccess);

// ✅ Get all users (Admin only)
userRouter.get("/getAllUser", authenticateToken, authorizeRoles("Admin"), userController.getAllUsers);

// ✅ Create a new user (Admin only)
userRouter.post("/createUser", authenticateToken, authorizeRoles("Admin"), userController.createUser);

// ✅ Update an existing user (Admin only)
userRouter.put("/updateUser/:ID", authenticateToken, authorizeRoles("Admin"), userController.updateUser);

// ✅ Delete a user (Admin only)
userRouter.delete("/deleteUser/:ID", authenticateToken, authorizeRoles("Admin"), userController.deleteUser);



// ✅ Admin & Contractor can access this route
userRouter.get("/contractor", authenticateToken, authorizeRoles("Admin", "Contractor"), userController.ContractorAccess);

// ✅ Admin & SectionHead can access this route
userRouter.get("/sectionhead", authenticateToken, authorizeRoles("Admin", "SectionHead"), userController.SectionHeadAccess);

// ✅ Admin & PlantHead can access this route
userRouter.get("/planthead", authenticateToken, authorizeRoles("Admin", "PlantHead"), userController.PlantHeadAccess);

// ✅ Admin & Security can access this route
userRouter.get("/security", authenticateToken, authorizeRoles("Admin", "Security"), userController.SecurityAccess);

module.exports = userRouter;

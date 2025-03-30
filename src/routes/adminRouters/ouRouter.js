const express = require("express");
const ouController = require("../../controllers/adminControllers/ouController");
const { authenticateToken, authorizeRoles } = require("../../middleware/authMiddleware");

const ouRouter = express.Router();

// ✅ Get all OUs (Admin only)
ouRouter.get("/getAllOUs", authenticateToken, authorizeRoles("Admin"), ouController.getAllOUs);

// ✅ Get OU by ID (Admin only)
ouRouter.get("/getOUById/:ID", authenticateToken, authorizeRoles("Admin"), ouController.getOUById);

// ✅ Create a new OU (Admin only)
ouRouter.post("/createOU", authenticateToken, authorizeRoles("Admin"), ouController.createOU);

// ✅ Update an OU (Admin only)
ouRouter.put("/updateOU/:ID", authenticateToken, authorizeRoles("Admin"), ouController.updateOU);

// ✅ Delete an OU (Admin only)
ouRouter.delete("/deleteOU/:ID", authenticateToken, authorizeRoles("Admin"), ouController.deleteOU);

module.exports = ouRouter;

const express = require("express");
const mouTypeRouter = express.Router();
const { authenticateToken, authorizeRoles } = require("../../middleware/authMiddleware");
const ouTypeController = require("../../controllers/adminControllers/ouTypeController");

// ✅ Get all MOU Types (Admin only)
mouTypeRouter.get("/getAll", authenticateToken, authorizeRoles("Admin"), ouTypeController.getAllOUTypes);

// ✅ Get a single MOU Type by ID (Admin only)
mouTypeRouter.get("/get/:ID", authenticateToken, authorizeRoles("Admin"), ouTypeController.getOUTypeById);

// ✅ Create a new MOU Type (Admin only)
mouTypeRouter.post("/create", authenticateToken, authorizeRoles("Admin"), ouTypeController.createOUType);

// ✅ Update an MOU Type (Admin only)
mouTypeRouter.put("/update/:ID", authenticateToken, authorizeRoles("Admin"), ouTypeController.updateOUType);

// ✅ Delete an MOU Type (Admin only)
mouTypeRouter.delete("/delete/:ID", authenticateToken, authorizeRoles("Admin"), ouTypeController.deleteOUType);

module.exports = mouTypeRouter;

const express = require("express");
const ownerRouter = express.Router();
const { authenticateToken, authorizeRoles } = require("../../middleware/authMiddleware");
const ownerController = require("../../controllers/adminControllers/ownerController");


// ✅ Get all owners (Admin only)
ownerRouter.get("/getAllOwners", authenticateToken, authorizeRoles("Admin"), ownerController.getAllOwners);

// ✅ Get owner by ID (Admin only)
ownerRouter.get("/getOwnerById/:ID", authenticateToken, authorizeRoles("Admin"), ownerController.getOwnerById);

// ✅ Create a new owner (Admin only)
ownerRouter.post("/createOwner", authenticateToken, authorizeRoles("Admin"), ownerController.createOwner);

// ✅ Update an existing owner (Admin only)
ownerRouter.put("/updateOwner/:ID", authenticateToken, authorizeRoles("Admin"), ownerController.updateOwner);

// ✅ Delete an owner (Admin only)
ownerRouter.delete("/deleteOwner/:ID", authenticateToken, authorizeRoles("Admin"), ownerController.deleteOwner);


module.exports = ownerRouter;

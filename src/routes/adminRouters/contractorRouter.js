const express = require("express");
const contractorRouter = express.Router();
const { authenticateToken, authorizeRoles } = require("../../middleware/authMiddleware");
const upload = require("../../help/multer"); // ✅ Import multer instance

const { getAllContractors, getContractorById, createContractor, updateContractor, deleteContractor } = require("../../controllers/adminControllers/contractorController");



// ✅ Get all contractors (Admin only)
contractorRouter.get("/getAllContractors", authenticateToken, authorizeRoles("Admin"), getAllContractors);

// ✅ Get contractor by ID (Admin only)
contractorRouter.get("/getContractorById/:ID", authenticateToken, authorizeRoles("Admin"), getContractorById);

// ✅ Create a new contractor (Admin only)
///contractorRouter.post("/createContractor", authenticateToken, authorizeRoles("Admin"), createContractor);

// ✅ Create a new contractor (Admin only) with multiple file uploads
// Use `upload.fields([...])` instead of `upload.any()`
contractorRouter.post("/createContractor", authenticateToken, authorizeRoles("Admin"),
    upload.fields([
        { name: "ESIDocument", maxCount: 1 },
        { name: "LicenseDocument", maxCount: 1 },
        { name: "GSTDocument", maxCount: 1 },
        { name: "EPFDocument", maxCount: 1 }
    ]),
    createContractor
);



// ✅ Update an existing contractor (Admin only)
///contractorRouter.put("/updateContractor/:ID", authenticateToken, authorizeRoles("Admin"), updateContractor);

contractorRouter.put("/updateContractor/:ID", authenticateToken, authorizeRoles("Admin"),
upload.fields([
    { name: "ESIDocument", maxCount: 1 },
    { name: "LicenseDocument", maxCount: 1 },
    { name: "GSTDocument", maxCount: 1 },
    { name: "EPFDocument", maxCount: 1 }
]),
    updateContractor
);




// ✅ Delete a contractor (Admin only)
contractorRouter.delete("/deleteContractor/:ID", authenticateToken, authorizeRoles("Admin"), deleteContractor);

module.exports = contractorRouter;

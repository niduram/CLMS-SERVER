const { sql, poolPromise } = require("../../config/db");

/** ✅ Get all MOU Types */
const getAllOUTypes = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT ID, OUType, ParentOUType, CreatedOn FROM tblMOUType
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No OU Types found",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "OU Types retrieved successfully",
            data: result.recordset,
        });
    } catch (error) {
        console.error("Error retrieving MOU Types:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** ✅ Get MOU Type by ID */
const getOUTypeById = async (req, res) => {
    try {
        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({
                success: false,
                message: "MOU Type ID is required",
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID, OUType, ParentOUType, CreatedOn FROM tblMOUType WHERE ID = @ID");

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "MOU Type not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "MOU Type retrieved successfully",
            data: result.recordset[0],
        });
    } catch (error) {
        console.error("Error retrieving MOU Type:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** ✅ Create a new MOU Type */
const createOUType = async (req, res) => {
    try {
        const { OUType, ParentOUType } = req.body;

        if (!OUType) {
            return res.status(400).json({
                success: false,
                message: "OUType is required",
            });
        }

        const pool = await poolPromise;

        // Check if OUType already exists
        const checkExist = await pool.request()
            .input("OUType", sql.VarChar, OUType)
            .query("SELECT ID FROM tblMOUType WHERE OUType = @OUType");

        if (checkExist.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: "MOU Type already exists",
            });
        }

        // Insert new MOU Type
        const result = await pool.request()
            .input("OUType", sql.VarChar, OUType)
            .input("ParentOUType", sql.Int, ParentOUType || null)
            .query(`
                INSERT INTO tblMOUType (OUType, ParentOUType, CreatedOn)
                VALUES (@OUType, @ParentOUType, GETDATE())
            `);

        res.status(201).json({
            success: true,
            message: "MOU Type created successfully",
        });
    } catch (error) {
        console.error("Error creating MOU Type:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** ✅ Update an MOU Type */
const updateOUType = async (req, res) => {
    try {
        const { ID } = req.params;
        const { OUType, ParentOUType } = req.body;

        if (!ID || !OUType) {
            return res.status(400).json({
                success: false,
                message: "ID and OUType are required",
            });
        }

        const pool = await poolPromise;

        // Check if MOU Type exists
        const checkExist = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMOUType WHERE ID = @ID");

        if (checkExist.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "MOU Type not found",
            });
        }

        // Update MOU Type
        await pool.request()
            .input("ID", sql.Int, ID)
            .input("OUType", sql.VarChar, OUType)
            .input("ParentOUType", sql.Int, ParentOUType || null)
            .query(`
                UPDATE tblMOUType 
                SET OUType = @OUType, ParentOUType = @ParentOUType
                WHERE ID = @ID
            `);

        res.status(200).json({
            success: true,
            message: "OU Type updated successfully",
        });
    } catch (error) {
        console.error("Error updating MOU Type:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** ✅ Delete an MOU Type */
const deleteOUType = async (req, res) => {
    try {
        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({
                success: false,
                message: "MOU Type ID is required",
            });
        }

        const pool = await poolPromise;

        // Check if MOU Type exists
        const checkExist = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMOUType WHERE ID = @ID");

        if (checkExist.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "MOU Type not found",
            });
        }

        // Delete MOU Type
        await pool.request()
            .input("ID", sql.Int, ID)
            .query("DELETE FROM tblMOUType WHERE ID = @ID");

        res.status(200).json({
            success: true,
            message: "MOU Type deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting MOU Type:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = {
    getAllOUTypes,
    getOUTypeById,
    createOUType,
    updateOUType,
    deleteOUType,
};

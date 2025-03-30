const { sql, poolPromise } = require("../../config/db");

/** Get all designations */
const getAllDesignations = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT ID, Code, Name, CreatedOn FROM tblMDesignation
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No designations found",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Designations retrieved successfully",
            data: result.recordset,
        });
    } catch (error) {
        console.error("Error retrieving designations:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** Get a single designation by ID */
const getDesignationById = async (req, res) => {
    try {
        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({
                success: false,
                message: "Designation ID is required",
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID, Code, Name, CreatedOn FROM tblMDesignation WHERE ID = @ID");

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Designation not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Designation retrieved successfully",
            data: result.recordset[0],
        });
    } catch (error) {
        console.error("Error retrieving designation:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** Create a new designation */
const createDesignation = async (req, res) => {
    try {
        const { Code, Name } = req.body;

        if (!Code || !Name) {
            return res.status(400).json({
                success: false,
                message: "Code and Name are required",
            });
        }

        const pool = await poolPromise;
        await pool.request()
            .input("Code", sql.VarChar, Code)
            .input("Name", sql.VarChar, Name)
            .query(`
                INSERT INTO tblMDesignation (Code, Name, CreatedOn)
                VALUES (@Code, @Name, GETDATE())
            `);

        res.status(201).json({
            success: true,
            message: "Designation created successfully",
        });
    } catch (error) {
        console.error("Error creating designation:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** Update a designation */
const updateDesignation = async (req, res) => {
    try {
        const { ID } = req.params;
        const { Code, Name } = req.body;

        if (!ID || !Code || !Name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const pool = await poolPromise;

        // Check if designation exists
        const designationCheck = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMDesignation WHERE ID = @ID");

        if (designationCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Designation not found",
            });
        }

        // Update designation
        await pool.request()
            .input("ID", sql.Int, ID)
            .input("Code", sql.VarChar, Code)
            .input("Name", sql.VarChar, Name)
            .query(`
                UPDATE tblMDesignation 
                SET Code = @Code, Name = @Name
                WHERE ID = @ID
            `);

        res.status(200).json({
            success: true,
            message: "Designation updated successfully",
        });
    } catch (error) {
        console.error("Error updating designation:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** Delete a designation */
const deleteDesignation = async (req, res) => {
    try {
        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({
                success: false,
                message: "Designation ID is required",
            });
        }

        const pool = await poolPromise;

        // Check if designation exists
        const designationCheck = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMDesignation WHERE ID = @ID");

        if (designationCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Designation not found",
            });
        }

        // Delete designation
        await pool.request()
            .input("ID", sql.Int, ID)
            .query("DELETE FROM tblMDesignation WHERE ID = @ID");

        res.status(200).json({
            success: true,
            message: "Designation deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting designation:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = {
    getAllDesignations,
    getDesignationById,  // <-- New function added
    createDesignation,
    updateDesignation,
    deleteDesignation
};

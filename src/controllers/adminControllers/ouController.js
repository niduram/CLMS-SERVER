const { sql, poolPromise } = require("../../config/db");

/** ✅ Get all Organizational Units (OUs) */
const getAllOUs = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT ID, OUCode, OUName, OUType, ParentOU, CreatedOn, OwnerID, UniqueID 
            FROM tblMOU
        `);

        res.status(200).json({
            success: true,
            message: "OUs retrieved successfully",
            data: result.recordset,
        });
    } catch (error) {
        console.error("Error retrieving OUs:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** ✅ Get OU by ID */
const getOUById = async (req, res) => {
    try {
        const { ID } = req.params;

        const pool = await poolPromise;
        const result = await pool.request()
            .input("ID", sql.Int, ID)
            .query(`
                SELECT ID, OUCode, OUName, OUType, ParentOU, CreatedOn, OwnerID, UniqueID 
                FROM tblMOU 
                WHERE ID = @ID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "OU not found" });
        }

        res.status(200).json({
            success: true,
            message: "OU retrieved successfully",
            data: result.recordset[0],
        });
    } catch (error) {
        console.error("Error retrieving OU:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

/** ✅ Create a new OU */
const createOU = async (req, res) => {
    try {
        const { OUCode, OUName, OUType, ParentOU, OwnerID, UniqueID } = req.body;

        if (!OUCode || !OUName || !OUType) {
            return res.status(400).json({ success: false, message: "OUCode, OUName, and OUType are required" });
        }

        const pool = await poolPromise;

        // Check if OUCode already exists
        const checkExist = await pool.request()
            .input("OUCode", sql.VarChar, OUCode)
            .query("SELECT ID FROM tblMOU WHERE OUCode = @OUCode");

        if (checkExist.recordset.length > 0) {
            return res.status(400).json({ success: false, message: "OU with this OUCode already exists" });
        }

        // Insert new OU
        await pool.request()
            .input("OUCode", sql.VarChar, OUCode)
            .input("OUName", sql.VarChar, OUName)
            .input("OUType", sql.Int, OUType)
            .input("ParentOU", sql.Int, ParentOU || null)
            .input("OwnerID", sql.Int, OwnerID || null)
            .input("UniqueID", sql.VarChar, UniqueID || null)
            .query(`
                INSERT INTO tblMOU (OUCode, OUName, OUType, ParentOU, CreatedOn, OwnerID, UniqueID)
                VALUES (@OUCode, @OUName, @OUType, @ParentOU, GETDATE(), @OwnerID, @UniqueID)
            `);

        res.status(201).json({ success: true, message: "OU created successfully" });
    } catch (error) {
        console.error("Error creating OU:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

/** ✅ Update an OU */
const updateOU = async (req, res) => {
    try {
        const { ID } = req.params;
        const { OUCode, OUName, OUType, ParentOU, OwnerID, UniqueID } = req.body;

        if (!ID || !OUCode || !OUName || !OUType) {
            return res.status(400).json({ success: false, message: "ID, OUCode, OUName, and OUType are required" });
        }

        const pool = await poolPromise;

        // Check if OU exists
        const checkExist = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMOU WHERE ID = @ID");

        if (checkExist.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "OU not found" });
        }

        // Update OU
        await pool.request()
            .input("ID", sql.Int, ID)
            .input("OUCode", sql.VarChar, OUCode)
            .input("OUName", sql.VarChar, OUName)
            .input("OUType", sql.Int, OUType)
            .input("ParentOU", sql.Int, ParentOU || null)
            .input("OwnerID", sql.Int, OwnerID || null)
            .input("UniqueID", sql.VarChar, UniqueID || null)
            .query(`
                UPDATE tblMOU 
                SET OUCode = @OUCode, OUName = @OUName, OUType = @OUType, 
                    ParentOU = @ParentOU, OwnerID = @OwnerID, UniqueID = @UniqueID
                WHERE ID = @ID
            `);

        res.status(200).json({ success: true, message: "OU updated successfully" });
    } catch (error) {
        console.error("Error updating OU:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

/** ✅ Delete an OU */
const deleteOU = async (req, res) => {
    try {
        const { ID } = req.params;

        const pool = await poolPromise;

        // Check if OU exists
        const checkExist = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMOU WHERE ID = @ID");

        if (checkExist.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "OU not found" });
        }

        // Delete OU
        await pool.request()
            .input("ID", sql.Int, ID)
            .query("DELETE FROM tblMOU WHERE ID = @ID");

        res.status(200).json({ success: true, message: "OU deleted successfully" });
    } catch (error) {
        console.error("Error deleting OU:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getAllOUs,
    getOUById,
    createOU,
    updateOU,
    deleteOU,
};

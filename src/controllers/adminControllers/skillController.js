const { sql, poolPromise } = require("../../config/db");

/** Get all skills */
const getAllSkills = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT ID, Code, Name, CreatedOn FROM tblMSkill
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No skills found",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Skills retrieved successfully",
            data: result.recordset,
        });
    } catch (error) {
        console.error("Error retrieving skills:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** Get a single skill by ID */
const getSkillById = async (req, res) => {
    try {
        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({
                success: false,
                message: "Skill ID is required",
            });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID, Code, Name, CreatedOn FROM tblMSkill WHERE ID = @ID");

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Skill retrieved successfully",
            data: result.recordset[0],
        });
    } catch (error) {
        console.error("Error retrieving skill:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** Create a new skill */

const createSkill = async (req, res) => {
    try {
        const { Code, Name } = req.body;

        if (!Code || !Name) {
            return res.status(400).json({
                success: false,
                message: "Code and Name are required",
            });
        }

        const pool = await poolPromise;

        // Check if skill already exists
        const skillExists = await pool.request()
            .input("Code", sql.VarChar, Code)
            .query("SELECT ID FROM tblMSkill WHERE Code = @Code");

        if (skillExists.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Skill with this Code already exists",
            });
        }

        // Insert new skill
        await pool.request()
            .input("Code", sql.VarChar, Code)
            .input("Name", sql.VarChar, Name)
            .query(`
                INSERT INTO tblMSkill (Code, Name, CreatedOn)
                VALUES (@Code, @Name, GETDATE())
            `);

        res.status(201).json({
            success: true,
            message: "Skill created successfully",
        });
    } catch (error) {
        console.error("Error creating skill:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


/** Update a skill */
const updateSkill = async (req, res) => {
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

        // Check if skill exists
        const skillCheck = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMSkill WHERE ID = @ID");

        if (skillCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        // Update skill
        await pool.request()
            .input("ID", sql.Int, ID)
            .input("Code", sql.VarChar, Code)
            .input("Name", sql.VarChar, Name)
            .query(`
                UPDATE tblMSkill 
                SET Code = @Code, Name = @Name
                WHERE ID = @ID
            `);

        res.status(200).json({
            success: true,
            message: "Skill updated successfully",
        });
    } catch (error) {
        console.error("Error updating skill:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** Delete a skill */
const deleteSkill = async (req, res) => {
    try {
        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({
                success: false,
                message: "Skill ID is required",
            });
        }

        const pool = await poolPromise;

        // Check if skill exists
        const skillCheck = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMSkill WHERE ID = @ID");

        if (skillCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Skill not found",
            });
        }

        // Delete skill
        await pool.request()
            .input("ID", sql.Int, ID)
            .query("DELETE FROM tblMSkill WHERE ID = @ID");

        res.status(200).json({
            success: true,
            message: "Skill deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting skill:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = {
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
};

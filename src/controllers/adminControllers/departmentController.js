const { sql, poolPromise } = require("../../config/db");



/** Get all departments */
const getAllDepartments = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT ID, Code, Name, CreatedOn FROM tblMDepartment
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No departments found",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Departments retrieved successfully",
            data: result.recordset,
        });
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** Create a new department */
const createDepartment = async (req, res) => {
    try {
        const { Code, Name } = req.body;

        if (!Code || !Name) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const pool = await poolPromise;
        await pool.request()
            .input("Code", sql.VarChar, Code)
            .input("Name", sql.VarChar, Name)
            .query(`
                INSERT INTO tblMDepartment (Code, Name, CreatedOn)
                VALUES (@Code, @Name, GETDATE())
            `);

        res.status(201).json({ 
            success: true, 
            message: "Department created successfully" 
        });
    } catch (error) {
        console.error("Error creating department:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** Update an existing department */
const updateDepartment = async (req, res) => {
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

        // Check if department exists
        const departmentCheck = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMDepartment WHERE ID = @ID");

        if (departmentCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        await pool.request()
            .input("ID", sql.Int, ID)
            .input("Code", sql.VarChar, Code)
            .input("Name", sql.VarChar, Name)
            .query(`
                UPDATE tblMDepartment 
                SET Code = @Code, Name = @Name
                WHERE ID = @ID
            `);

        res.status(200).json({
            success: true,
            message: "Department updated successfully",
            updatedDepartment: {
                ID,
                Code,
                Name
            }
        });

    } catch (error) {
        console.error("Error updating department:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/** Delete a department */
const deleteDepartment = async (req, res) => {
    try {
        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({
                success: false,
                message: "Department ID is required",
            });
        }

        const pool = await poolPromise;

        // Check if department exists
        const departmentCheck = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMDepartment WHERE ID = @ID");

        if (departmentCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        await pool.request()
            .input("ID", sql.Int, ID)
            .query("DELETE FROM tblMDepartment WHERE ID = @ID");

        res.status(200).json({
            success: true,
            message: "Department deleted successfully",
            deletedDepartmentId: ID
        });

    } catch (error) {
        console.error("Error deleting department:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = {
  
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment
};

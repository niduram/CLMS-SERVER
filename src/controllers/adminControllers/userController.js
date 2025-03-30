const { sql, poolPromise } = require("../../config/db");



const adminAccess = (req, res) => {
    res.json({ message: "Welcome, Admin!" });
};

const ContractorAccess = (req, res) => {
    res.json({ message: "Welcome, Admin or Contractor!" });
};

const SectionHeadAccess = (req, res) => {
    res.json({ message: "Welcome, Admin or SectionHead!" });
};

const PlantHeadAccess = (req, res) => {
    res.json({ message: "Welcome, Admin or PlantHead!" });
};

const SecurityAccess = (req, res) => {
    res.json({ message: "Welcome, Admin or Security!" });
};



/** * Get all users from tblMUser */

const getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                ID, UserRole, UserName, EmployeeID, CreatedOn, LoginType, LoginOn, RequestedOn, LoginAttemptCount 
            FROM tblMUser
        `);
        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found",
                data: [],
            });
        }
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.recordset,
        });
    } catch (error) {
        console.error("Error fetching users:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


/* Create a new user */
const createUser = async (req, res) => {
    try {
        const { UserRole, UserName, Password, EmployeeID, LoginType } = req.body;

        if (!UserRole || !UserName || !Password || !EmployeeID || !LoginType) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const pool = await poolPromise;
        await pool.request()
            .input("UserRole", UserRole)
            .input("UserName", UserName)
            .input("Password", Password)
            .input("EmployeeID", EmployeeID)
            .input("LoginType", LoginType)
            .query(`
                INSERT INTO tblMUser (UserRole, UserName, Password, EmployeeID, CreatedOn, LoginType)
                VALUES (@UserRole, @UserName, @Password, @EmployeeID, GETDATE(), @LoginType)
            `);

        res.json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/** * Update an existing user in tblMUser */
const updateUser = async (req, res) => {
    try {
        const { ID } = req.params;
        const { UserRole, UserName, Password, EmployeeID, LoginType } = req.body;

        // Validate required fields
        if (!ID || !UserRole || !UserName || !EmployeeID || !LoginType) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const pool = await poolPromise;
        
        // Check if the user exists before updating
        const userCheck = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM tblMUser WHERE ID = @ID");

        if (userCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // ⚠️ Hash password before storing in production (e.g., bcrypt)
        await pool.request()
            .input("ID", sql.Int, ID)
            .input("UserRole", UserRole)
            .input("UserName", UserName)
            .input("Password", Password)
            .input("EmployeeID", EmployeeID)
            .input("LoginType", LoginType)
            .query(`
                UPDATE tblMUser 
                SET UserRole = @UserRole, UserName = @UserName, Password = @Password, 
                    EmployeeID = @EmployeeID, LoginType = @LoginType
                WHERE ID = @ID
            `);

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            updatedUser: {
                ID,
                UserRole,
                UserName,
                EmployeeID,
                LoginType,
            }
        });

    } catch (error) {
        console.error("❌ Error updating user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


/**
 * Delete a user from tblMUser
 */
const deleteUser = async (req, res) => {
    try {
        const { ID } = req.params;

        // Validate required field
        if (!ID) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        const pool = await poolPromise;

        // Check if the user exists before attempting to delete
        const userCheck = await pool.request()
            .input("ID",  ID)
            .query("SELECT ID FROM tblMUser WHERE ID = @ID");

        if (userCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Proceed with deletion
        await pool.request()
            .input("ID",  ID)
            .query("DELETE FROM tblMUser WHERE ID = @ID");

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedUserId: ID
        });

    } catch (error) {
        console.error("❌ Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


module.exports = {
    adminAccess,
    ContractorAccess,
    SectionHeadAccess,
    PlantHeadAccess,
    SecurityAccess,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser

};

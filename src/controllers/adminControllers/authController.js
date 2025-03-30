// Import the JWT package to generate and verify tokens
const jwt = require("jsonwebtoken");

// Import the SQL database connection pool
const { sql, poolPromise } = require("../../config/db");

// Import the JWT secret key from the configuration file
const { jwtSecret } = require("../../secret");

// Define the login function
const login = async (req, res) => {
    try {
        console.log("Received login request:", req.body);

        // Handle case sensitivity for request body keys
        const Username = req.body.Username || req.body.Usename;
        const Password = req.body.Password || req.body.password;

        // Validate that username and password are provided
        if (!Username || !Password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Get a connection from the database pool
        const pool = await poolPromise;

        // Query the database for the user with their role
        const result = await pool.request()
            .input("Username", sql.VarChar, Username)
            .query(`
                SELECT 
                    u.ID AS UserID,        
                    u.UserName,            
                    u.EmployeeID,          
                    u.Password,            -- Include password for comparison
                    r.UserRole             
                FROM tblMUser u
                INNER JOIN tblMUserRole r ON u.UserRole = r.UserRole_Id
                WHERE u.UserName = @Username
            `);

        // If no user is found, return an error response
        if (result.recordset.length === 0) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Retrieve the user details from the query result
        const user = result.recordset[0];

        // Check if the provided password matches the stored password
        if (Password !== user.Password) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate a JWT token with user details
        const token = jwt.sign(
            { userId: user.UserID, role: user.UserRole, employeeId: user.EmployeeID },
            jwtSecret,
            { expiresIn: "1h" }
        );

        // Send the token in the response header for authentication
        res.setHeader("Authorization", `Bearer ${token}`);

        // Send response with token and user details
        res.json({ 
            message: "Login successful", 
            token, 
            user: {
                userId: user.UserID,
                UserName: user.UserName,
                employeeId: user.EmployeeID,
                role: user.UserRole
            } 
        });

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Export the login function
module.exports = { login };

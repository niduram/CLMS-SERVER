const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../secret");

/**
 * Middleware to authenticate the JWT token.
 * Ensures that the request has a valid token before granting access to protected routes.
 */
const authenticateToken = (req, res, next) => {
    // Extract the Authorization header from the request
    const authHeader = req.headers.authorization;

    // Check if the Authorization header is missing or doesn't start with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized. Token is required." });
    }

    // Extract the token by removing the "Bearer " prefix
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret key
    jwt.verify(token, jwtSecret, (err, user) => {
        // If the token is invalid or expired, return a 403 Forbidden error
        if (err) {
            return res.status(403).json({ message: "Forbidden. Invalid token." });
        }

        // If the token is valid, attach the decoded user data to the request object
        req.user = user;

        // Proceed to the next middleware or controller
        next();
    });
};

/**
 * Middleware to authorize users based on their roles.
 * Restricts access to routes based on the allowed roles.
 * 
 * @param {...string} allowedRoles - The list of roles allowed to access the route.
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if the logged-in user's role is in the list of allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }

        // If the user has the required role, proceed to the next middleware or controller
        next();
    };
};

// Export the authentication and authorization middleware for use in routes
module.exports = { authenticateToken, authorizeRoles };

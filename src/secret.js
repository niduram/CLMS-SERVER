require("dotenv").config();

console.log("🔄 Loading Environment Variables...");
console.log("SQL_SERVER_USER:", process.env.SQL_SERVER_USER);
console.log("SQL_SERVER_NAME:", process.env.SQL_SERVER_NAME);

const secret = {
    serverPort: process.env.SERVER_PORT || 3002,

    db: {
        user: process.env.SQL_SERVER_USER,
        password: process.env.SQL_SERVER_PASSWORD,
        server: process.env.SQL_SERVER_NAME,
        database: process.env.SQL_DATABASE_NAME,
        options: {
            encrypt: true,
            trustServerCertificate: true,
        },
        port: parseInt(process.env.SQL_SERVER_PORT, 10) || 1433,
    },
    jwtSecret: process.env.JWT_SECRET || "defaultSecret", // JWT Secret
};

module.exports = secret;

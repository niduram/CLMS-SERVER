
///db.js file

const sql = require("mssql");
const { db } = require("../secret"); // Import database config

console.log("🔄 Initializing Database Connection...");

// Create a connection pool and log status
const poolPromise = new sql.ConnectionPool(db)
    .connect()
    .then((pool) => {
        console.log("✅ MS SQL Database Connected Successfully!");
        return pool;
    })
    .catch((err) => {
        console.error("❌ Database Connection Failed!", err.message);
        process.exit(1); // Exit process on failure
    });

module.exports = {
    sql,
    poolPromise,
};

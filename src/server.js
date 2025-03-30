///db.js file
const app = require("./app");
const { serverPort } = require("./secret");
require("./config/db"); // Ensure DB is initialized when server starts

// Start Server
app.listen(serverPort, () => {
    console.log(`🚀 Server is running at http://localhost:${serverPort}`);
});

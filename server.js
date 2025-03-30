///db.js file
const app = require("./src/app");
const { serverPort } = require("./src/secret");
require("./src/config/db"); // Ensure DB is initialized when server starts

// Start Server
app.listen(serverPort, () => {
    console.log(`🚀 Server is running at http://localhost:${serverPort}`);
});

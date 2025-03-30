const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors"); // Import http-errors package
const authRoutes = require("./routes/adminRouters/authRoutes");
const userRouter = require("./routes/adminRouters/userRouter");
const departmentRouter = require("./routes/adminRouters/departementRouter");
const designationRouter = require("./routes/adminRouters/designationRoutes");
const skillRouter = require("./routes/adminRouters/skillRoutes");
const ouRouter = require("./routes/adminRouters/ouRouter");
const ownerRouter = require("./routes/adminRouters/ownerRouter");
const contractorRouter = require("./routes/adminRouters/contractorRouter");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to the server" });
});




app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/department", departmentRouter);
app.use("/api/designation", designationRouter);
app.use("/api/skill", skillRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/ou", ouRouter);
app.use("/api/contractor",contractorRouter);







// Example Route That Throws a Custom Error
app.get("/error", (req, res, next) => {
    next(createError(400, "This is a bad request example"));
});

// 🛑 Client Error Handling (404 - Route Not Found)
app.use((req, res, next) => {
    next(createError(404, "Route Not Found"));
});

// ⚠️ Global Server Error Handling (Handles All Uncaught Errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
        error: {
            code: err.status || 500,
            message: err.message || "Internal Server Error",
            errors: [
                {
                    message: err.message || "An unexpected error occurred.",
                    domain: "server",
                    reason: err.reason || "internal_error",
                },
            ],
        },
    });
});

module.exports = app;

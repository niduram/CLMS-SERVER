///authRoutes File

const express = require("express");
const { login } = require("../../controllers/adminControllers/authController");
const authRoutes = express.Router();



authRoutes.post('/login', login);

module.exports = authRoutes
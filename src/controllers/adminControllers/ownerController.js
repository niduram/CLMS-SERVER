const express = require("express");
const sql = require("mssql");
const dbConfig = require("../../config/db"); // Ensure you have a database config file

// Get all Owners
const getAllOwners = async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query("SELECT * FROM tblMOwner");
        res.status(200).json({ success: true, data: result.recordset });
    } catch (error) {
        console.error("Error fetching owners:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get Owner by ID
const getOwnerById = async (req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input("ID", sql.Int, id)
            .query("SELECT * FROM tblMOwner WHERE ID = @ID");

        if (result.recordset.length === 0) {
            return res.status(404).json({ success: false, message: "Owner not found" });
        }
        res.status(200).json({ success: true, data: result.recordset[0] });
    } catch (error) {
        console.error("Error fetching owner:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Create a new Owner
const createOwner = async (req, res) => {
    try {
        const { Name, EmailID, MobNo, SecondaryEmailID } = req.body;

        if (!Name || !EmailID || !MobNo) {
            return res.status(400).json({ success: false, message: "Name, EmailID, and MobNo are required" });
        }

        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input("Name", sql.VarChar(50), Name)
            .input("EmailID", sql.VarChar(50), EmailID)
            .input("MobNo", sql.VarChar(20), MobNo)
            .input("SecondaryEmailID", sql.VarChar(50), SecondaryEmailID || null)
            .query(`
                INSERT INTO tblMOwner (Name, EmailID, MobNo, SecondaryEmailID) 
                VALUES (@Name, @EmailID, @MobNo, @SecondaryEmailID)
            `);

        res.status(201).json({ success: true, message: "Owner created successfully" });
    } catch (error) {
        console.error("Error creating owner:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Update an Owner
const updateOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, EmailID, MobNo, SecondaryEmailID } = req.body;

        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input("ID", sql.Int, id)
            .input("Name", sql.VarChar(50), Name)
            .input("EmailID", sql.VarChar(50), EmailID)
            .input("MobNo", sql.VarChar(20), MobNo)
            .input("SecondaryEmailID", sql.VarChar(50), SecondaryEmailID || null)
            .query(`
                UPDATE tblMOwner 
                SET Name = @Name, EmailID = @EmailID, MobNo = @MobNo, SecondaryEmailID = @SecondaryEmailID 
                WHERE ID = @ID
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Owner not found" });
        }

        res.status(200).json({ success: true, message: "Owner updated successfully" });
    } catch (error) {
        console.error("Error updating owner:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Delete an Owner
const deleteOwner = async (req, res) => {
    try {
        const { id } = req.params;

        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input("ID", sql.Int, id)
            .query("DELETE FROM tblMOwner WHERE ID = @ID");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Owner not found" });
        }

        res.status(200).json({ success: true, message: "Owner deleted successfully" });
    } catch (error) {
        console.error("Error deleting owner:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { getAllOwners, getOwnerById, createOwner, updateOwner, deleteOwner };

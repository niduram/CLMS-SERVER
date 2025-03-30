const db = require("../../config/db"); // Adjust based on your DB connection
const { sql, poolPromise } = require("../../config/db");


// ✅ Get all contractors
const getAllContractors = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT   *  FROM CLMS.tblMContractor
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No contractors found",
                data: [],
            });
        }

        res.status(200).json({
            success: true,
            message: "Contractors retrieved successfully",
            data: result.recordset,
        });
    } catch (error) {
        console.error("Error fetching contractors:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// ✅ Get contractor by ID
const getContractorById = async (req, res) => {
    const { ID } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("ID", ID) // Use parameterized queries to prevent SQL injection
            .query(`
                SELECT *   FROM CLMS.tblMContractor  WHERE ID = @ID
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Contractor not found",
                data: null,
            });
        }

        res.status(200).json({
            success: true,
            message: "Contractor retrieved successfully",
            data: result.recordset[0],
        });
    } catch (error) {
        console.error("Error fetching contractor:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// ✅ Create a new contractor (Now includes IssuedDate, ExpiredDate, Document fields)

const createContractor = async (req, res) => {
    const {
        ContractorNo, ContractorName, ContactPersonName, ContactPersonNo, ContactPersonEmail, Address,
        GSTNo, GSTIssuedDate, GSTExpiredDate, LicenseNo, LicenseIssuedDate, LicenseExpiredDate,
        EPFNo, EPFIssuedDate, EPFExpiredDate, ESINo, ESIIssuedDate, ESIExpiredDate,
        BankAccountName, BankAccountNumber, BankName, BankBranchName, IFSCCode
    } = req.body;

    const ESIDocument = req.files?.ESIDocument ? req.files.ESIDocument[0].filename : null;
    const LicenseDocument = req.files?.LicenseDocument ? req.files.LicenseDocument[0].filename : null;
    const GSTDocument = req.files?.GSTDocument ? req.files.GSTDocument[0].filename : null;
    const EPFDocument = req.files?.EPFDocument ? req.files.EPFDocument[0].filename : null;
  
    try {
        if (!ContractorName || !ContactPersonName || !ContactPersonNo) {
            return res.status(400).json({
                success: false,
                message: "ContractorName, ContactPersonName, and ContactPersonNo are required fields",
            });
        }

        const pool = await poolPromise;
        await pool.request()
            .input("ContractorNo", ContractorNo)
            .input("ContractorName", ContractorName)
            .input("ContactPersonName", ContactPersonName)
            .input("ContactPersonNo", ContactPersonNo)
            .input("ContactPersonEmail", ContactPersonEmail)
            .input("Address", Address)
            .input("GSTNo", GSTNo)
            .input("GSTIssuedDate", GSTIssuedDate)
            .input("GSTExpiredDate", GSTExpiredDate)
            .input("GSTDocument", GSTDocument)

            .input("LicenseNo", LicenseNo)
            .input("LicenseIssuedDate", LicenseIssuedDate)
            .input("LicenseExpiredDate", LicenseExpiredDate)
            .input("EPFNo", EPFNo)
            .input("EPFIssuedDate", EPFIssuedDate)
            .input("EPFExpiredDate", EPFExpiredDate)
            .input("EPFDocument", EPFDocument)
            .input("ESINo", ESINo)
            .input("ESIIssuedDate", ESIIssuedDate)
            .input("ESIExpiredDate", ESIExpiredDate)
            .input("ESIDocument", ESIDocument)
            .input("LicenseDocument", LicenseDocument)
            .input("BankAccountName", BankAccountName)
            .input("BankAccountNumber", BankAccountNumber)
            .input("BankName", BankName)
            .input("BankBranchName", BankBranchName)
            .input("IFSCCode", IFSCCode)
            .query(`
                INSERT INTO [CLMS].[tblMContractor] (
                    ContractorNo, ContractorName, ContactPersonName, ContactPersonNo, ContactPersonEmail, Address,
                    GSTNo, GSTIssuedDate, GSTExpiredDate, LicenseNo, LicenseIssuedDate, LicenseExpiredDate,
                    EPFNo, EPFIssuedDate, EPFExpiredDate, ESINo, ESIIssuedDate, ESIExpiredDate,
                    ESIDocument, LicenseDocument, EPFDocument,GSTDocument,BankAccountName, BankAccountNumber, BankName, BankBranchName, IFSCCode, CreatedOn
                ) VALUES (
                    @ContractorNo, @ContractorName, @ContactPersonName, @ContactPersonNo, @ContactPersonEmail, @Address,
                    @GSTNo, @GSTIssuedDate, @GSTExpiredDate, @LicenseNo, @LicenseIssuedDate, @LicenseExpiredDate,
                    @EPFNo, @EPFIssuedDate, @EPFExpiredDate, @ESINo, @ESIIssuedDate, @ESIExpiredDate,
                    @ESIDocument, @LicenseDocument,@EPFDocument,@GSTDocument, @BankAccountName, @BankAccountNumber, @BankName, @BankBranchName, @IFSCCode, GETDATE()
                )
            `);

        res.status(201).json({
            success: true,
            message: "Contractor created successfully",
        });
    } catch (error) {
        console.error("Error creating contractor:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



// ✅ Update an existing contractor


const updateContractor = async (req, res) => {
    const { ID } = req.params;
    const ESIDocument = req.files?.ESIDocument ? req.files.ESIDocument[0].filename : null;
    const LicenseDocument = req.files?.LicenseDocument ? req.files.LicenseDocument[0].filename : null;

    try {
        const pool = await poolPromise;

        await pool.request()
            .input("ID", ID)
            .input("ESIDocument", ESIDocument)
            .input("LicenseDocument", LicenseDocument)
            .query(`
                UPDATE [CLMS].[tblMContractor] 
                SET ESIDocument = ISNULL(@ESIDocument, ESIDocument),
                    LicenseDocument = ISNULL(@LicenseDocument, LicenseDocument)
                WHERE ID = @ID
            `);

        res.status(200).json({
            success: true,
            message: "Contractor updated successfully",
        });
    } catch (error) {
        console.error("Error updating contractor:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};





// ✅ Delete a contractor
const deleteContractor = async (req, res) => {
    try {
        const { ID } = req.params;

        if (!ID) {
            return res.status(400).json({
                success: false,
                message: "Contractor ID is required",
            });
        }

        const pool = await poolPromise;

        // Check if the contractor exists
        const contractorCheck = await pool.request()
            .input("ID", sql.Int, ID)
            .query("SELECT ID FROM [CLMS].[tblMContractor] WHERE ID = @ID");

        if (contractorCheck.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Contractor not found",
            });
        }

        // Delete the contractor
        await pool.request()
            .input("ID", sql.Int, ID)
            .query("DELETE FROM [CLMS].[tblMContractor] WHERE ID = @ID");

        res.status(200).json({
            success: true,
            message: "Contractor deleted successfully",
            deletedContractorId: ID
        });

    } catch (error) {
        console.error("Error deleting contractor:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


module.exports = { getAllContractors, createContractor, updateContractor, getContractorById, deleteContractor };
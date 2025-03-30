const multer = require("multer");
const path = require("path");

// Custom storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Define different upload paths for different document types
        let uploadPath = "uploads/"; // Default path for fallback

        switch (file.fieldname) {
            case "ESIDocument":
                uploadPath = "uploads/ESIDocuments/";
                break;
            case "LicenseDocument":
                uploadPath = "uploads/LicenseDocuments/";
                break;
            case "GSTDocument":
                uploadPath = "uploads/GSTDocuments/";
                break;
            case "EPFDocument":
                uploadPath = "uploads/EPFDocuments/";
                break;
            default:
                uploadPath = "uploads/OtherDocuments/"; // Fallback folder
                break;
        }

        cb(null, uploadPath); // Set the final upload path
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname); // Get the file extension
        const contractorNo = req.body.ContractorNo || "default"; // Get ContractorNo from the body or use a fallback
        
        // Define a custom filename structure for each document type
        let fileName = "";

        switch (file.fieldname) {
            case "ESIDocument":
                fileName = `${contractorNo}_ESI${fileExt}`; // Example: contractorNo_ESI.pdf
                break;
            case "LicenseDocument":
                fileName = `${contractorNo}_License${fileExt}`; // Example: contractorNo_License.pdf
                break;
            case "GSTDocument":
                fileName = `${contractorNo}_GST${fileExt}`; // Example: contractorNo_GST.pdf
                break;
            case "EPFDocument":
                fileName = `${contractorNo}_EPF${fileExt}`; // Example: contractorNo_EPF.pdf
                break;
            default:
                fileName = `${contractorNo}_${file.fieldname}${fileExt}`; // Generic name fallback
                break;
        }

        cb(null, fileName); // Set the final file name
    }
});

// Initialize multer with the custom storage configuration
const upload = multer({ storage });

module.exports = upload;

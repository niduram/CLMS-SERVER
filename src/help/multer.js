const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Change path as needed
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        const contractorNo = req.body.ContractorNo || "default"; // Get ContractorNo, fallback to "default"
        
        const fileName = `${contractorNo}_${file.fieldname}${fileExt}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage });

module.exports = upload;

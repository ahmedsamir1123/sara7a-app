import { fileTypeFromBuffer } from "file-type";
import fs from "fs";

// Middleware to validate file type by magic number (file signatures)
export const fileValidation = (fileFormat = ["image/jpeg", "image/png", "image/jpg"]) => {
    return async (req, res, next) => {

        // get the file path
        const filePath = req.file.path;
        // read the file and return buffer and create file
        if (!filePath) {
            fs.mkdirSync(filePath, { recursive: true });
        }
        const buffer = fs.readFileSync(filePath);
        // get the file type
        const type = await fileTypeFromBuffer(buffer);
        // validate
        if (!type || !fileFormat.includes(type.mime))
            return next(new Error("Invalid file type"));        // fileFormat = ["image/jpeg", "image/png", "image/jpg"])
        next();

    }
};
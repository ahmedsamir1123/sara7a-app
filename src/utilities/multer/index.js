import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import fs from "node:fs"
export function fileUpload(fileFormat = ["image/jpeg", "image/png", "image/jpg"]) {
    const storage = diskStorage({
        destination: (req, file, cb) => {

            let dest = `uploads/${req.user.id}`
            fs.mkdirSync(dest, { recursive: true })
            cb(null, dest);
        },
        filename: (req, file, cb) => {
            cb(null, nanoid(5) + "-" + file.originalname)
        }

    })
    const fileFilter = (req, file, cb) => {


        if (fileFormat.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("Invalid file type", { cause: 400 }))
        }
    }
    return multer({ fileFilter, storage, limits: { fileSize: 5 * 1024 * 1024 } })
}
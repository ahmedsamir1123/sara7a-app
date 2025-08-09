import { Router } from "express";
import * as userController from "./user.service.js";
import { fileUpload } from "../../utilities/multer/index.js";
import { fileValidation } from "../../middleware/file-validation.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const router = Router();

router.delete("/deleteaccount", authMiddleware,userController.deleteAccount);
router.put("/editprofile", authMiddleware,userController.editProfile);
router.patch("/changepassword", authMiddleware,userController.changePassword);
router.get("/getuserprofile", authMiddleware,userController.getUserProfile);
router.post("/uploadprofilepic", authMiddleware, fileUpload().single("img"), fileValidation(), userController.uploadProfilePic);


export default router;

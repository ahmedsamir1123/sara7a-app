import { Router } from "express";
import * as userController from "./user.service.js";
import { fileUpload } from "../../utilities/multer/index.js";
import { fileValidation } from "../../middleware/file-validation.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
const router = Router();

router.delete("/deleteaccount", userController.deleteAccount);
router.put("/editprofile", userController.editProfile);
router.patch("/changepassword", userController.changePassword);
router.get("/getuserprofile", userController.getUserProfile);
router.post("/uploadprofilepic", authMiddleware, fileUpload().single("img"), fileValidation(), userController.uploadProfilePic);


export default router;

import { Router } from "express";
import * as userController from "./user.service.js";
const router = Router();

router.delete("/deleteaccount", userController.deleteAccount);
router.put("/editprofile", userController.editProfile);
router.patch("/changepassword", userController.changePassword);
router.get("/getuserprofile", userController.getUserProfile);


export default router;

import { Router } from "express";
import * as auth from "./auth.service.js";

const router = Router();

router.post("/register", auth.register);
router.post("/verfiy", auth.verfiyAccount);
router.post("/resendotp", auth.resendotp);
router.post("/login", auth.login);
router.post("/forgetpassword", auth.forgetpassword);
router.post("/resetpassword", auth.resetpassword);
router.post("/google-login", auth.googlelogin);
export default router;

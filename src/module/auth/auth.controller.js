import { Router } from "express";
import * as auth from "./auth.service.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { registerSchema } from "./auth.validation.js";
import cookieParser from "cookie-parser";
const router = Router();

router.post("/register", isValid(registerSchema), auth.register);
router.post("/verfiy", auth.verfiyAccount);
router.post("/resendotp", auth.resendotp);
router.post("/login", auth.login);
router.post("/forgetpassword", auth.forgetpassword);
router.post("/resetpassword", auth.resetpassword);
router.post("/google-login", auth.googlelogin);
router.post("/refresh-token", cookieParser(), auth.getNewAccessToken);
export default router;

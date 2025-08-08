import { User } from "../db/model/user.model.js";
import { verfieTOken } from "../utilities/token/index.js";
export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const payload = verfieTOken(token);
    const userexist = await User.findById(payload.id);
    if (!userexist) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
    req.user = userexist;
    next();
}  
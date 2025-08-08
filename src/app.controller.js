import cors from "cors";
import { connectDB } from "./db/connection.js";
import authRouter from "./module/auth/auth.controller.js";
import userRouter from "./module/user/user.controller.js";
import { startDeleteUnverifiedJob } from "./jops/delet-not-verfiy-user.js";
export default function bootsrap(app, express) {
    app.use("/uploads", express.static("uploads"));
    app.use(express.json());
    app.use(cors({
        origin: "http://localhost:5173",

    }));

    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    connectDB();

    startDeleteUnverifiedJob();
    // err handler
    app.use((err, req, res, next) => {
        res.status(err.cause || 500).json({ message: err.message, success: false, stack: err.stack });
    })
}

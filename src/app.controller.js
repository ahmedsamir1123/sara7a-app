import cors from "cors";
import { connectDB } from "./db/connection.js";
import authRouter from "./module/auth/auth.controller.js";
export default function bootsrap(app, express) {

    app.use(express.json());
    app.use(cors({
        origin: "http://localhost:5173",

    }));

    app.use("/auth", authRouter)
    connectDB();
    // err handler
    app.use((err, req, res, next) => {
        res.status(err.cause || 500).json({ message: err.message, success: false, stack: err.stack });
    })
}

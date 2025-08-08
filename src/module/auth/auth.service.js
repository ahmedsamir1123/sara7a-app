import { User } from "../../db/model/user.model.js";
import bcrypt from "bcryptjs";
import { sendmail } from "../../utilities/email/index.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
export const register = async (req, res, next) => {

    // get data from request
    const { firstName, lastName, email, password, phone, dob } = req.body;
    // validation

    // user existance 

    const userExist = await User.findOne({
        $or: [{
            $and:
                [{ email: { $ne: null } }, { email: { $exists: true } }, { email }]
        }
            , { $and: [{ phone: { $ne: null } }, { phone: { $exists: true } }, { phone }] }
        ]
    });

    if (userExist) {
        throw new Error("User already exists", { cause: 408 });
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        dob
    })
    // send Maill
    const otp = Math.floor(Math.random() * 900000 + 100000);
    const otpexpire = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpexpire = otpexpire;
    if (email) {
        await sendmail({
            to: email,
            subject: "verfiy your account",
            html: `<h1>your otp for verfiy your account is :${otp}</h1>`
        })

    }



    // save user
    await user.save();
    res.status(201).json({ message: "User registered successfully", success: true });




}
// verfiy account
export const verfiyAccount = async (req, res, next) => {

    const { otp, email } = req.body;
    const user = await User.findOne({ otp, email, otpexpire: { $gt: Date.now() } });
    if (!user) {
        throw new Error("otp expired", { cause: 401 });
    }
    user.isverifed = true;
    user.otp = undefined;
    user.otpexpire = undefined;
    await user.save();
    res.status(200).json({ message: "User verfied successfully", success: true });

}
// resend otp
export const resendotp = async (req, res, next) => {

    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    const otp = Math.floor(Math.random() * 900000 + 100000);
    const otpexpire = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpexpire = otpexpire;
    await sendmail({
        to: email,
        subject: "verfiy your account",
        html: `<h1>your otp for verfiy your account is :${otp}</h1>`
    })

    // save user
    await user.save();
    res.status(200).json({ message: "otp sent successfully", success: true });

}
//login 
export const login = async (req, res, next) => {

    const { email, phone, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials", { cause: 401 });
    }
    if (!user.isverifed) {
        throw new Error("User not verfied", { cause: 401 });

    }
    const token = jwt.sign({ id: user._id }, "12345678901234567890123456789012", { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user._id }, "12345678901234567890123456789012", { expiresIn: "7d" });
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ message: "User logged in successfully", success: true, token });

}

// forget password
export const forgetpassword = async (req, res, next) => {
    const { email, phone } = req.body;
    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    const otp = Math.floor(Math.random() * 900000 + 100000);
    const otpexpire = new Date(Date.now() + 10 * 60 * 1000);
    user.otp = otp;
    user.otpexpire = otpexpire;
    await sendmail({
        to: user.email,
        subject: "forget password",
        html: `<h1>your otp for forget password is :${otp}</h1>`
    })
    await user.save();
    res.status(200).json({ message: "otp sent successfully", success: true });
}
// reset password
export const resetpassword = async (req, res, next) => {
    const { otp, email, phone, password } = req.body;
    const user = await User.findOne({ otp, $or: [{ email }, { phone }], otpexpire: { $gt: Date.now() } });
    if (!user) {
        throw new Error("otp expired", { cause: 401 });
    }
    user.password = await bcrypt.hash(password, 10);
    user.otp = undefined;
    user.otpexpire = undefined;
    await user.save();
    res.status(200).json({ message: "User password reset successfully", success: true });
}

// google login
export const googlelogin = async (req, res, next) => {
    const { idToken } = req.body;
    const client = new OAuth2Client("766230823603-7u5uith3ivsf8jfc4pbthedggblskv6a.apps.googleusercontent.com");
    const ticket = await client.verifyIdToken({ idToken });
    const payload = ticket.getPayload();
    console.log(payload);

    let userExist = await User.findOne({ email: payload.email });
    if (!userExist) {
        userExist = await User.create({
            firstName: payload.given_name,
            lastName: payload.family_name,
            email: payload.email,
            phone: payload.phone,
            dob: payload.birthdate,
            isverifed: true,
            userAgent: "google"
        });
        await userExist.save();
    }
    const token = jwt.sign({ id: userExist._id }, "12345678901234567890123456789012", { expiresIn: "1h" });
    res.status(200).json({ message: "User logged in successfully", success: true, token });
}

// refresh token
export const getNewAccessToken = async (req, res, next) => {
console.log(req.cookies);

    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided", success: false });
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
        return res.status(403).json({ message: "Invalid refresh token", success: false });
    }
    jwt.verify(refreshToken, "12345678901234567890123456789012", (err, payload) => {
        if (err) {
            return res.status(403).json({ message: "Refresh token expired or invalid", success: false });
        }

        const newAccessToken = jwt.sign(
            { id: user._id },
            "12345678901234567890123456789012",
            { expiresIn: "1h" }
        );

        res.status(200).json({ accessToken: newAccessToken, success: true });
    });


};
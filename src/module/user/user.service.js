import { User } from "../../db/model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from 'node:fs';

// delete account
export const deleteAccount = async (req, res, next) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "12345678901234567890123456789012");
    const user = await User.findByIdAndDelete(decoded.id);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    res.status(200).json({ message: "User deleted successfully", success: true });
}

// edit profile 
export const editProfile = async (req, res, next) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "12345678901234567890123456789012");
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.dob = req.body.dob || user.dob;
    await user.save();
    res.status(200).json({ message: "User profile updated successfully", success: true });
}

// change password
export const changePassword = async (req, res, next) => {
    const token = req.headers.authorization;
    const {password, oldPassword} = req.body;
    const decoded = jwt.verify(token, "12345678901234567890123456789012");
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new Error("Invalid  password", { cause: 401 });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    res.status(200).json({ message: "User password changed successfully", success: true });
}

// get user profile
export const getUserProfile = async (req, res, next) => {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, "12345678901234567890123456789012");
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new Error("User not found", { cause: 404 });
    }
    res.status(200).json({ message: "User profile fetched successfully", success: true, user });
}

// upload profile pic
export const uploadProfilePic = async (req, res, next) => {
    console.log(req.file);
    const user = req.user;
    if (user.imgurl) {
        fs.unlinkSync(user.imgurl);
    }
    user.imgurl = req.file.path;
    await user.save();
    res.status(200).json({ message: "User profile pic uploaded successfully", success: true, user });
}
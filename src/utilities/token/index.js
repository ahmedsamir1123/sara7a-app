import jwt from "jsonwebtoken";
export function verfieTOken(token) {
    return jwt.verify(token, "12345678901234567890123456789012");
}
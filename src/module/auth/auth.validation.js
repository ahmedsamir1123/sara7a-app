import joi from "joi"
export const registerSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email(),
    password: joi.string().min(8).max(20).required(),
    phone: joi.string().length(11),
    dob: joi.date(),
}).or("email", "phone");
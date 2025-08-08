import { model, Schema } from "mongoose";

const schema = new Schema({
    firstName: {
        type: String,
        trim: true,
        lowercase: true,
    },
    lastName: {
        type: String,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: function () {
            if (this.phone) {
                return false;
            }
            return true;
        }

    },
    password: {
        type: String,
        required: function () {
            if (this.userAgent === "google") {
                return false;
            }
            return true;
        },
    },
    phone: {
        type: String,
        required: function () {
            if (this.email) {
                return false;
            }
            return true;
        }
    },
    dob: {
        type: Date,

    },
    otp: {
        type: Number,
    },
    otpexpire: {
        type: Date,
    },
    isverifed: {
        type: Boolean,
        default: false
    },
    userAgent: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    imgurl: {
        type: String
    },
    refreshToken: {
        type: String
    }

}, {
    timestamps: true
});
schema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`;
})
schema.virtual("age").get(function () {
    return new Date().getFullYear() - new Date(this.dob).getFullYear();
})
export const User = model("User", schema);
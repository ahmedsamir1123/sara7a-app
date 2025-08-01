import mongoose from "mongoose";

export function connectDB() {
      mongoose.connect("mongodb://localhost:27017/sara7a-app").then(() => {
        console.log("Connected to MongoDB");
    }).catch((err) => {
        console.log("Error connecting to MongoDB", err.message);
    });
}


import mongoose, { model } from "mongoose";
import { IUserModel } from "../@types/user.type";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    isActive: { type: Boolean, required: true },
}, {
    timestamps: true
});

export default model<IUserModel>('User', userSchema);
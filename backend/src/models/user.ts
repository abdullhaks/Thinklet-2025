// src/models/userModel.ts
import { Schema, model } from "mongoose";
import { IUserDocument } from "../entities/userEntity";

const userSchema: Schema<IUserDocument> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String ,required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: String },
  preferences: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = model<IUserDocument>("User", userSchema);

export default User;

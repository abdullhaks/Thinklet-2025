// src/models/userModel.ts
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile:{ type: String},
  preferences: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
});

const User = model('User', userSchema);
export default User
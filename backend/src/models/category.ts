// src/models/userModel.ts
import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true },
  articles: { type: Number},
 
});

const Category = model('Category', categorySchema);
export default Category
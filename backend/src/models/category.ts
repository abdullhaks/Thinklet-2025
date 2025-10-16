// src/models/userModel.ts
import { Schema, model } from 'mongoose';
import { ICategoryDocument } from '../entities/categoryEntity';

const categorySchema:Schema<ICategoryDocument> = new Schema({
  name: { type: String, required: true },
  articles: { type: Number},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Category = model<ICategoryDocument>('Category', categorySchema);
export default Category
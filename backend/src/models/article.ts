// src/models/articleModel.ts
import { Schema, model } from 'mongoose';

const articleSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail:{type:String},
  tags: [{ type: String }],
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Article = model('Article', articleSchema);

export default Article
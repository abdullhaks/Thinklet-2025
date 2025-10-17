import { Document, Types } from "mongoose";

export interface ICategoryDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  articles: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface categoryDocument extends ICategoryDocument {}

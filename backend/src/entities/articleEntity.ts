import { Document, Types } from "mongoose";

export interface IArticleDocument extends Document {

    _id: Types.ObjectId;
    title: string;
    description: string;
    thumbnail:string;
    tags: string[];
    category: Types.ObjectId;
    author: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    
}
export interface articleDocument extends IArticleDocument {}

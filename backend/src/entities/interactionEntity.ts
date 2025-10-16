import { Document, Types } from "mongoose";

export interface IInteractionDocument extends Document {

    _id: Types.ObjectId;
    user: Types.ObjectId;
    article: Types.ObjectId;
    like: boolean;
    dislike: boolean;
    block: boolean;
    createdAt: Date;
    updatedAt: Date;
    
}
export interface interactionDocument extends IInteractionDocument {}


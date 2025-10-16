// src/models/interactionModel.ts
import { Schema, model } from 'mongoose';
import { IInteractionDocument } from '../entities/interactionEntity';

const interactionSchema:Schema<IInteractionDocument> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  like: { type: Boolean, default: false },
  dislike: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

});

const Interaction = model<IInteractionDocument>('Interaction', interactionSchema);

export default Interaction
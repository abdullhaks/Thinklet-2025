// src/models/interactionModel.ts
import { Schema, model } from 'mongoose';

const interactionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  article: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
  like: { type: Boolean, default: false },
  dislike: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
});

const Interaction = model('Interaction', interactionSchema);

export default Interaction
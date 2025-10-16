import { inject, injectable } from "inversify";
import BaseRepository from "./baseRepository";
import { interactionDocument } from "../../entities/interactionEntity";
import { Model } from "mongoose";



@injectable()
export default class InteractionRepository extends BaseRepository<interactionDocument> {
  constructor(@inject("interactionModel") _interactionModel: Model<interactionDocument>) {
    super(_interactionModel);
  }






};

import BaseRepository from "../implementations/baseRepository";
import { IUserDocument } from "../../entities/userEntity";

export default interface IUserRepository
  extends BaseRepository<IUserDocument> {}

import { Document, FilterQuery, UpdateQuery } from "mongoose";

export default interface IBaseRepository<T extends Document> {
  findOne(filter: FilterQuery<T>, options: { sort?: Record<string, 1 | -1> } ): Promise<T | null>;
  findAll(filter: FilterQuery<T>, options: { sort?: Record<string, 1 | -1> }): Promise<T[] | []>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
}


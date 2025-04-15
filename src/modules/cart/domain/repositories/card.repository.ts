import { IRepository } from "../../../../share/interface";
import { CartType } from "../entities/card.entity";
import { CartCondType, CartUpdateType } from "../object-value";

export interface ICartRepository
  extends IRepository<CartType, CartCondType, CartUpdateType> {}

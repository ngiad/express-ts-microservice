import { CartItemBranchType } from "../entities/card.entity"



export interface IBranchCartItemRPCRepository{
    getById : (id : string) => Promise<CartItemBranchType | null>
    getByList : (ids : string[]) => Promise<CartItemBranchType[]>
}


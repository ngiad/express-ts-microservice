import { CartProductType } from "../entities/card.entity";


export interface IProductRPCRepository {
    getById(id: string): Promise<CartProductType | null>
    getByList(ids: string[]): Promise<CartProductType[]>
}

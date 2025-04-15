import axios from "axios";
import { IProductRPCRepository } from "../../../domain/repositories/product.rpc.repository";
import { CartProductSchema, CartItemBranchType, CartItemBranchSchema, CartProductType } from "../../../domain/entities/card.entity";
import { IBranchCartItemRPCRepository } from "../../../domain/repositories/branch.rpc.repository";



export class RPCProductRepository implements IProductRPCRepository{
    constructor(private readonly url : string){}

    getById = async (id: string): Promise<CartProductType | null> => {
        try {
            const { data } = await axios.get(`${this.url}/v1/api/rpc/products/${id}`)
            return CartProductSchema.parse(data.value)
        } catch (error) {
            return null
        }
    }


    getByList = async (ids: string[]): Promise<CartProductType[]> => {
        try {
            const query = ids.map((id) => `id=${id}`).join("&")
            const { data } = await axios.get(`${this.url}/v1/api/rpc/products?${query}`)
            return CartProductSchema.array().parse(data.value)
        } catch (error) {
            return []
        }
    }

}


export class RPCBranchCartItem implements IBranchCartItemRPCRepository{
    constructor(private readonly url : string){}

    getById = async (id: string): Promise<CartItemBranchType | null> => {
        try {
            const { data } = await axios.get(`${this.url}/v1/api/rpc/branches/${id}`)
            return CartItemBranchSchema.parse(data.value)
        } catch (error) {
            return null
        }
    }

    getByList = async (ids: string[]): Promise<CartItemBranchType[]> => {
        try {
            const query = ids.map((id) => `id=${id}`).join("&")
            const { data } = await axios.get(`${this.url}/v1/api/rpc/branches?${query}`)
            return CartItemBranchSchema.array().parse(data.value)
        } catch (error) {
            return []
        }
    }
}

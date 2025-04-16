import axios from "axios";
import { IProductRPCRepository } from "../../../domain/repositories/product.rpc.repository";
import { CartProductSchema, CartItemBranchType, CartItemBranchSchema, CartProductType } from "../../../domain/entities/card.entity";
import { IBranchCartItemRPCRepository } from "../../../domain/repositories/branch.rpc.repository";
import { Redis } from "../../../../../share/component/redis";



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


// proxy pattern


export class ProxyRPCProductRepository implements IProductRPCRepository{
    constructor(private readonly origin : IProductRPCRepository){}
    private getRedis = () => Redis.init()
    private getCacheKey = (id: string) => `cart-product:${id}`

    getById = async (id: string): Promise<CartProductType | null> => {
        const key = this.getCacheKey(id)
        const cached = await this.getRedis().get(key)
        if(cached){
            return JSON.parse(cached)
        }
        const product = await this.origin.getById(id)
        await this.getRedis().set(key, JSON.stringify(product), 60 * 10)
        return product
    }

    getByList = async (ids: string[]): Promise<CartProductType[]> => {
        const { get, set } = this.getRedis()
        const result: CartProductType[] = []
        const missingIds: string[] = []

        for(const id of ids){
            const key = this.getCacheKey(id)
            const cached = await get(key)
            if(cached){
                result.push(JSON.parse(cached))
            }else{
                missingIds.push(id)
            }
        }

        if(missingIds.length > 0){
            const fetched : CartProductType[] = await this.origin.getByList(missingIds)
            for(const product of fetched){
                const key = this.getCacheKey(product.id)
                await set(key, JSON.stringify(product), 60 * 10)
                result.push(product)
            }
        }
        return result
    }
}

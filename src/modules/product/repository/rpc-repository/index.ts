import axios from "axios";
import { IRPCCategoryQueryRepository, IPRCProductBranchQueryRepository } from "../../interface";
import { ProductBranchSchema, ProductBranchType, ProductCategorySchema, ProductCategoryType } from "../../model";

export class RPCProductBranchRopository implements IPRCProductBranchQueryRepository{
    constructor(private readonly baseUrl : string){}
    getBranchById = async (id: string): Promise<ProductBranchType | null> => {
        try {
            const { data } = await axios.get(`${this.baseUrl}/v1/api/branches/${id}`);
            const branch = ProductBranchSchema.parse(data.value) 
            return branch; 
        } catch (error) {
            return null
        }
    }
}


export class RPCProductCategoryRopository implements IRPCCategoryQueryRepository{
    constructor(private readonly baseUrl : string){}
    getCategoryById = async (id: string): Promise<ProductCategoryType | null> => {
        try {
            const { data } = await axios.get(`${this.baseUrl}/v1/api/categories/${id}`);
            const category = ProductCategorySchema.parse(data.data) 
            return category; 
        } catch (error) {
            return null
        }
    }
}




// proxy pattern demo, thêm nghiệp vụ cho lớp ban đầu mà giữ nguyên cấu trúc

export class ProxyProductBranchRopository implements IPRCProductBranchQueryRepository{
    private cached : Record<string, ProductBranchType | null> = {}
    constructor(private readonly origin : IPRCProductBranchQueryRepository){}
    getBranchById = async (id: string): Promise<ProductBranchType | null> => {
        try {
            if (this.cached[id]) return this.cached[id]
            const branch = await this.origin.getBranchById(id)
            this.cached[id] = branch
            return branch; 
        } catch (error) {
            return null
        }
    }
}

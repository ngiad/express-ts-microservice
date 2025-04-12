import axios from "axios";
import { IRPCCategoryQueryRepository, IPRCProductBranchQueryRepository } from "../../interface";
import { ProductBranchSchema, ProductBranchType, ProductCategorySchema, ProductCategoryType } from "../../model";

export class RPCProductBranchRopository implements IPRCProductBranchQueryRepository{
    constructor(private readonly baseUrl : string){}
    getBranchById = async (id: string): Promise<ProductBranchType | null> => {
        try {
            const { data } = await axios.get(`${this.baseUrl}/v1/api/rpc/branches/${id}`);
            const branch = ProductBranchSchema.parse(data.value) 
            return branch; 
        } catch (error) {
            return null
        }
    }

    getBranchByIds = async(ids: string[]):Promise<ProductBranchType[]> => {
        try {
            const query = ids.map((id) => `id=${id}`).join("&")
            const { data } = await axios.get(`${this.baseUrl}/v1/api/rpc/branches?${query}`)
            const branches = ProductBranchSchema.array().parse(data.value)
            return branches;
        } catch (error) {
            return []
        }
    }
}


export class RPCProductCategoryRopository implements IRPCCategoryQueryRepository{
    constructor(private readonly baseUrl : string){}
    getCategoryById = async (id: string): Promise<ProductCategoryType | null> => {
        try {
            const { data } = await axios.get(`${this.baseUrl}/v1/api/rpc/categories/${id}`);
            const category = ProductCategorySchema.parse(data.value) 
            return category; 
        } catch (error) {
            return null
        }
    }

    getCategoryByIds = async(ids: string[]):Promise<ProductCategoryType[]> => {
        try {
            const query = ids.map((id) => `id=${id}`).join("&")
            const { data } = await axios.get(`${this.baseUrl}/v1/api/rpc/categories?${query}`)
            const categorys = ProductCategorySchema.array().parse(data.value)
            return categorys;
        } catch (error) {
            return []
        }
    }
}




// proxy pattern demo, thêm nghiệp vụ cho lớp ban đầu mà giữ nguyên cấu trúc

export class ProxyProductBranchRopository implements IPRCProductBranchQueryRepository {
    private cached: Record<string, ProductBranchType | null> = {};

    constructor(private readonly origin: IPRCProductBranchQueryRepository) {}

    getBranchById = async (id: string): Promise<ProductBranchType | null> => {
        if (this.cached[id]) return this.cached[id];

        const branch = await this.origin.getBranchById(id);
        this.cached[id] = branch;
        return branch;
    };

    getBranchByIds = async (ids: string[]): Promise<ProductBranchType[]> => {
        const result: ProductBranchType[] = [];
        const cachedBranches: ProductBranchType[] = [];
        const missingIds: string[] = [];

        for (const id of ids) {
            const cached = this.cached[id];
            if (cached) {
                cachedBranches.push(cached);
            } else {
                missingIds.push(id);
            }
        }

        const fetchedBranches = await this.origin.getBranchByIds(missingIds);
        for (const branch of fetchedBranches) {
            this.cached[branch.id] = branch;
        }

        for (const id of ids) {
            const branch = this.cached[id];
            if (branch) {
                result.push(branch);
            }
        }

        return result;
    };
}


import axios from "axios";
import {
  IRPCCategoryQueryRepository,
  IPRCProductBranchQueryRepository,
} from "../../interface";
import {
  ProductBranchSchema,
  ProductBranchType,
  ProductCategorySchema,
  ProductCategoryType,
} from "../../model";
import { Redis } from "../../../../share/component/redis";

export class RPCProductBranchRopository
  implements IPRCProductBranchQueryRepository
{
  constructor(private readonly baseUrl: string) {}
  getBranchById = async (id: string): Promise<ProductBranchType | null> => {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/v1/api/rpc/branches/${id}`
      );
      const branch = ProductBranchSchema.parse(data.value);
      return branch;
    } catch (error) {
      return null;
    }
  };

  getBranchByIds = async (ids: string[]): Promise<ProductBranchType[]> => {
    try {
      const query = ids.map((id) => `id=${id}`).join("&");
      const { data } = await axios.get(
        `${this.baseUrl}/v1/api/rpc/branches?${query}`
      );
      const branches = ProductBranchSchema.array().parse(data.value);
      return branches;
    } catch (error) {
      return [];
    }
  };
}

export class RPCProductCategoryRopository
  implements IRPCCategoryQueryRepository
{
  constructor(private readonly baseUrl: string) {}
  getCategoryById = async (id: string): Promise<ProductCategoryType | null> => {
    try {
      const { data } = await axios.get(
        `${this.baseUrl}/v1/api/rpc/categories/${id}`
      );
      const category = ProductCategorySchema.parse(data.value);
      return category;
    } catch (error) {
      return null;
    }
  };

  getCategoryByIds = async (ids: string[]): Promise<ProductCategoryType[]> => {
    try {
      const query = ids.map((id) => `id=${id}`).join("&");
      const { data } = await axios.get(
        `${this.baseUrl}/v1/api/rpc/categories?${query}`
      );
      const categorys = ProductCategorySchema.array().parse(data.value);
      return categorys;
    } catch (error) {
      return [];
    }
  };
}

// proxy pattern demo, thêm nghiệp vụ cho lớp ban đầu mà giữ nguyên cấu trúc

// export class ProxyProductBranchRopository implements IPRCProductBranchQueryRepository {
//     private cached: Record<string, ProductBranchType | null> = {};

//     constructor(private readonly origin: IPRCProductBranchQueryRepository) {}

//     getBranchById = async (id: string): Promise<ProductBranchType | null> => {
//         if (this.cached[id]) return this.cached[id];

//         const branch = await this.origin.getBranchById(id);
//         this.cached[id] = branch;
//         return branch;
//     };

//     getBranchByIds = async (ids: string[]): Promise<ProductBranchType[]> => {
//         const result: ProductBranchType[] = [];
//         const cachedBranches: ProductBranchType[] = [];
//         const missingIds: string[] = [];

//         for (const id of ids) {
//             const cached = this.cached[id];
//             if (cached) {
//                 cachedBranches.push(cached);
//             } else {
//                 missingIds.push(id);
//             }
//         }

//         const fetchedBranches = await this.origin.getBranchByIds(missingIds);
//         for (const branch of fetchedBranches) {
//             this.cached[branch.id] = branch;
//         }

//         for (const id of ids) {
//             const branch = this.cached[id];
//             if (branch) {
//                 result.push(branch);
//             }
//         }

//         return result;
//     };
// }

export class ProxyProductBranchRepository
  implements IPRCProductBranchQueryRepository
{
  constructor(private readonly origin: IPRCProductBranchQueryRepository) {}

  private getRedis = () => Redis.init();
  private getCacheKey = (id: string) => `product-branch:${id}`;

  async getBranchById(id: string): Promise<ProductBranchType | null> {
    const { get, set } = this.getRedis();
    const key = this.getCacheKey(id);

    const cached = await get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const branch = await this.origin.getBranchById(id);
    if (branch) {
      await set(key, JSON.stringify(branch), 60 * 10); // TTL 10 phút
    }
    return branch;
  }

  async getBranchByIds(ids: string[]): Promise<ProductBranchType[]> {
    const { get, set } = this.getRedis();

    const result: ProductBranchType[] = [];
    const missingIds: string[] = [];

    for (const id of ids) {
      const key = this.getCacheKey(id);
      const cached = await get(key);
      if (cached) {
        result.push(JSON.parse(cached));
      } else {
        missingIds.push(id);
      }
    }

    if (missingIds.length > 0) {
      const fetched = await this.origin.getBranchByIds(missingIds);
      for (const branch of fetched) {
        const key = this.getCacheKey(branch.id);
        await set(key, JSON.stringify(branch), 60 * 10);
        result.push(branch);
      }
    }

    return result;
  }
}

export class ProxyProductCategopryRepository
  implements IRPCCategoryQueryRepository
{
  constructor(private readonly origin: IRPCCategoryQueryRepository) {}
  private getRedis = () => Redis.init();
  private getCacheKey = (id: string) => `product-category:${id}`;

  async getCategoryById(id: string): Promise<ProductCategoryType | null> {
    const { get, set } = this.getRedis();
    const key = this.getCacheKey(id);

    const cached = await get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const category = await this.origin.getCategoryById(id);
    if (category) {
      await set(key, JSON.stringify(category), 60 * 10);
    }
    return category;
  }

  async getCategoryByIds(ids: string[]): Promise<ProductCategoryType[]> {
    const { get, set } = this.getRedis();
    const result: ProductCategoryType[] = [];
    const missingIds: string[] = [];

    for (const id of ids) {
      const key = this.getCacheKey(id);
      const cached = await get(key);

      if (cached) {
        result.push(JSON.parse(cached));
      } else {
        missingIds.push(id);
      }
    }

    if (missingIds.length > 0) {
      const fetched = await this.origin.getCategoryByIds(missingIds);
      for (const category of fetched) {
        const key = this.getCacheKey(category.id);
        await set(key, JSON.stringify(category), 60 * 10);
        result.push(category);
      }
    }

    return result;
  }
}

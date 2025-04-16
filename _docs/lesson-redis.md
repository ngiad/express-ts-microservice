## 📦 1. Cài Đặt Redis

### 🛠️ Cài Redis Local qua Docker:
```bash
docker run -d --name redis -p 6379:6379 -e REDIS_PASSWORD=yourpassword bitnami/redis:latest
```

> Redis sẽ chạy ở `127.0.0.1:6379` với mật khẩu `yourpassword`.

---

## 🧱 2. Khởi Tạo Redis Service

### 📁 Cấu trúc:
```
share/
  redis/
    redis.ts
    interface.ts
```

### 🔑 `interface.ts`
```ts
export interface IRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlInSeconds?: number): Promise<void>;
}
```

### 🧩 `redis.ts`
```ts
import { createClient, RedisClientType } from 'redis';
import { IRedisClient } from './interface';

export class Redis {
  private static client: RedisClientType | null = null;
  private static ready = false;

  static async start(url: string): Promise<void> {
    if (this.ready) return;

    this.client = createClient({ url });
    this.client.on('error', (err) => console.error('Redis error:', err));
    await this.client.connect();

    this.ready = true;
    console.log('✅ Redis connected');
  }

  static init(): IRedisClient {
    if (!this.ready || !this.client) {
      throw new Error('Redis not started. Please call Redis.start() first.');
    }

    return {
      get: this.get.bind(this),
      set: this.set.bind(this),
    };
  }

  private static async set(key: string, value: string, ttlInSeconds?: number): Promise<void> {
    if (!this.client) throw new Error('Redis not connected');
    await this.client.set(key, value, ttlInSeconds ? { EX: ttlInSeconds } : {});
  }

  private static async get(key: string): Promise<string | null> {
    if (!this.client) throw new Error('Redis not connected');
    return await this.client.get(key);
  }

  static async disconnect(): Promise<void> {
    if (this.client) await this.client.quit();
  }
}
```

---

## 🚀 3. Sử Dụng Redis trong Repository

### ✅ Ví dụ: `RPCProductCategoryRepository`

```ts
import axios from "axios";
import { ProductCategorySchema, ProductCategoryType } from "../../../domain/entities/product-category.entity";
import { IRPCCategoryQueryRepository } from "../../../domain/repositories/product-category.repository";
import { Redis } from "../../../../share/redis/redis";

export class RPCProductCategoryRepository implements IRPCCategoryQueryRepository {
  constructor(private readonly baseUrl: string) {}

  private getRedis = () => Redis.init();
  private getCacheKey = (id: string) => `category:${id}`;

  getCategoryById = async (id: string): Promise<ProductCategoryType | null> => {
    const { get, set } = this.getRedis();
    const key = this.getCacheKey(id);

    const cached = await get(key);
    if (cached) {
      return ProductCategorySchema.parse(JSON.parse(cached));
    }

    try {
      const { data } = await axios.get(`${this.baseUrl}/v1/api/rpc/categories/${id}`);
      const category = ProductCategorySchema.parse(data.value);
      await set(key, JSON.stringify(category), 600); // TTL: 10 phút
      return category;
    } catch {
      return null;
    }
  };

  getCategoryByIds = async (ids: string[]): Promise<ProductCategoryType[]> => {
    const { get, set } = this.getRedis();
    const result: ProductCategoryType[] = [];
    const missingIds: string[] = [];

    for (const id of ids) {
      const cached = await get(this.getCacheKey(id));
      if (cached) {
        result.push(ProductCategorySchema.parse(JSON.parse(cached)));
      } else {
        missingIds.push(id);
      }
    }

    if (missingIds.length > 0) {
      try {
        const query = missingIds.map((id) => `id=${id}`).join("&");
        const { data } = await axios.get(`${this.baseUrl}/v1/api/rpc/categories?${query}`);
        const fetched = ProductCategorySchema.array().parse(data.value);

        for (const category of fetched) {
          await set(this.getCacheKey(category.id), JSON.stringify(category), 600);
          result.push(category);
        }
      } catch {}
    }

    return result;
  };
}
```

---

## 🧪 4. Khởi Động Redis trong App

Trong `main.ts` hoặc đầu ứng dụng:

```ts
await Redis.start(process.env.REDIS_URL || 'redis://:yourpassword@127.0.0.1:6379');
```


## 5. Truy vấn điều kiện phức tạp và cách cache 1 list
## 🧠 Cách Cache Truy Vấn Với Điều Kiện Phức Tạp

---

### ✅ **Bước 1: Chuẩn hóa và Mã hóa điều kiện truy vấn**

Để cache có hiệu quả, ta cần **tạo ra một key duy nhất** cho mỗi tập điều kiện + phân trang.

#### 🔹 Lý do:
- JSON.stringify() có thể khác nhau về thứ tự key → cần chuẩn hóa trước khi hash.

#### 🔹 Ví dụ:
```ts
import crypto from "crypto";

function buildCacheKey(prefix: string, cond: any, paging: any): string {
  const normalized = {
    cond: sortObjectKeys(cond),
    paging: sortObjectKeys(paging),
  };
  const raw = JSON.stringify(normalized);
  const hash = crypto.createHash("md5").update(raw).digest("hex");
  return `${prefix}:${hash}`;
}

function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObjectKeys(obj[key]);
        return acc;
      }, {} as any);
  }
  return obj;
}
```

#### 🔸 Kết quả:

```ts
const cacheKey = buildCacheKey("product:list", cond, paging);
```

---

## ⚙️ **Yếu tố nâng cao**

---

### 🔄 1. **Invalidate Cache khi Dữ liệu Cập Nhật**

#### Giải pháp:
- Gắn TTL ngắn (5–30s) → tự xóa.
- Hoặc: khi gọi API `create/update/delete`, gọi thêm `Redis.del(cacheKey)` hoặc dùng wildcard `del product:list:*` (nếu Redis hỗ trợ `scan` + `del`).

> Redis không hỗ trợ wildcard trực tiếp qua `del`, cần `SCAN` trước:
```ts
async function deleteCacheByPrefix(prefix: string) {
  const keys = await redisClient.keys(`${prefix}:*`);
  if (keys.length > 0) await redisClient.del(keys);
}
```

---

### 🧩 2. **Dùng Redis Hash hoặc Set để Phân Vùng Cache Tốt Hơn**

Thay vì:
```ts
await Redis.set("product:list:...", data);
```

Ta có thể dùng:
```ts
await redisClient.hSet("product:list", cacheKey, data); // tất cả list nằm trong hash `product:list`
```

Lợi ích:
- Dễ `HDEL` theo key.
- Dễ xem toàn bộ cache theo nhóm (`HGETALL`).

---

### 🧠 3. **Cache Từng Phần Thay vì Toàn Bộ**

Ví dụ:
- Cache `product list` theo điều kiện.
- Cache riêng `branch` hoặc `category` theo `id`.

Khi `product` thay đổi → chỉ xóa cache `product:list:*`, không cần xóa cache `branch`.

---

## 🛠 Viết Helper / Abstract cho Redis Query Cache

---

### 🔧 `QueryCacheHelper.ts`

```ts
import { Redis } from "./redis"; // dùng static class
import crypto from "crypto";

export class QueryCache {
  static async getOrSet<T>(
    prefix: string,
    cond: any,
    paging: any,
    fetchFn: () => Promise<T>,
    ttl = 10
  ): Promise<T> {
    const key = this.buildCacheKey(prefix, cond, paging);
    const cached = await Redis.get(key);
    if (cached) return JSON.parse(cached);

    const data = await fetchFn();
    await Redis.set(key, JSON.stringify(data), ttl);
    return data;
  }

  static buildCacheKey(prefix: string, cond: any, paging: any): string {
    const normalized = {
      cond: sortObjectKeys(cond),
      paging: sortObjectKeys(paging),
    };
    const raw = JSON.stringify(normalized);
    const hash = crypto.createHash("md5").update(raw).digest("hex");
    return `${prefix}:${hash}`;
  }
}

function sortObjectKeys(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  if (obj && typeof obj === "object") {
    return Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = sortObjectKeys(obj[key]);
        return acc;
      }, {} as any);
  }
  return obj;
}
```

---

### 🔍 Cách dùng trong `ListProductService`

```ts
const result = await QueryCache.getOrSet(
  "product:list",
  cond,
  paging,
  async () => {
    const products = await this._repository.list(whereCondition, paging);
    if (!products.data.length) return { data: [], paging: { ...paging, total: 0 } };

    const branchIds = [...new Set(products.data.map(p => p.branchId).filter(Boolean))];
    const categoryIds = [...new Set(products.data.map(p => p.categoryId).filter(Boolean))];

    const [productBranches, productCategories] = await Promise.all([
      this._RPCProductBranch.getBranchByIds(branchIds),
      this._RPCProductCategory.getCategoryByIds(categoryIds),
    ]);

    const branchMap = new Map(productBranches.map(b => [b.id, b]));
    const categoryMap = new Map(productCategories.map(c => [c.id, c]));

    const merged = products.data.map(p => ({
      ...p,
      branch: branchMap.get(p.branchId!),
      category: categoryMap.get(p.categoryId!),
    }));

    return { data: merged, paging: products.paging };
  },
  15 // TTL 15s
);
```

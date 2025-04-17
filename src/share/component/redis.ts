import { createClient, RedisClientType } from 'redis';
import { CacheStrategyOptions, IRedisClient } from '../interface';
import { createHash } from 'crypto';

export class Redis{
  private static client: RedisClientType | null = null;
  private static ready = false;


  // cơ chế bind trong constructor - Đảm bảo phương thức được gắn vào đúng ngữ cảnh
  static {
    this.strategy = this.strategy.bind(this);
    this.invalidate = this.invalidate.bind(this);
  }

  static async start(url: string): Promise<void> {
    if (this.ready) return;

    this.client = createClient({ url });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    await this.client.connect();
    this.ready = true;
    console.log('Redis connected');
  }

  static init(): IRedisClient {
    if (!this.ready || !this.client) {
      throw new Error('Redis is not started. Please call RedisService.start(url) first.');
    }

    return {
      get: this.get.bind(this),
      set: this.set.bind(this),
    };
  }

  private static async set(key: string, value: string, ttlInSeconds?: number): Promise<void> {
    if (!this.client) throw new Error('Redis not connected');
    if (ttlInSeconds) {
      await this.client.set(key, value, { EX: ttlInSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  private static async get(key: string): Promise<string | null> {
    if (!this.client) throw new Error('Redis not connected');
    return await this.client.get(key);
  }

   private static calcTTLFromLevel(level?: number): number | undefined {
    if (!level || level <= 0) return undefined;
    if (level >= 10) return 86400;
    return Math.floor(level * 60); 
  }


  private static buildCacheKey(parts: (string | number | undefined | null)[], prefix?: string, hashIfLong = false): string {
    const joined = parts.filter(p => p !== null && p !== undefined).join(':');
    if (!hashIfLong || joined.length < 100) {
      return prefix ? `${prefix}:${joined}` : joined;
    }
    const hash = createHash('sha256').update(joined).digest('hex');
    return prefix ? `${prefix}:HASH:${hash}` : `HASH:${hash}`;
  }
  // Cách dùng strategy
  // const result = await Redis.strategy<ProductType>({
  //   keyParts: ['product', 'detail', productId],
  //   prefix: 'api',
  //   ttlLevel: 5, // khoảng 5 phút
  //   fetch: async () => {
  //     return await productRepository.getDetail(productId);
  //   },
  // });

  // demo trong user detail
  static async strategy<T>(options: CacheStrategyOptions<T>): Promise<T> {
    const key = this.buildCacheKey(options.keyParts, options.prefix, options.hashKeyIfLong);
    const ttl = this.calcTTLFromLevel(options.ttlLevel);

    const cached = await this.get(key);
    if (cached) return JSON.parse(cached) as T;

    const freshData = await options.fetch();
    await this.set(key, JSON.stringify(freshData), ttl);
    return freshData;
  }

  // Cách dùng invalidate
  // await Redis.invalidate(['product', 'detail', productId], 'api');
  static async invalidate(keyParts: (string | number | undefined | null)[], prefix?: string, hashKeyIfLong = false) {
    const key = this.buildCacheKey(keyParts, prefix, hashKeyIfLong);
    await this.client?.del(key);
  }

  static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      console.log('Redis disconnected');
    }
  }
}

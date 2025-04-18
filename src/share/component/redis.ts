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


export class RedisPubSubService {
  private static publisher: RedisClientType | null = null;
  private static subscriber: RedisClientType | null = null;
  private static isConnected = false;
  private static subscriptions = new Map<string, (message: string) => void>();

  static async connect(url: string): Promise<void> {
    if (this.isConnected) return;

    this.publisher = createClient({ url });
    this.subscriber = createClient({ url });

    this.publisher.on('error', console.error);
    this.subscriber.on('error', console.error);

    this.subscriber.on('message', (channel, message) => {
      const handler = this.subscriptions.get(channel);
      if (handler) {
        try {
          handler(message);
        } catch (err) {
          console.error(`Error in handler for channel "${channel}":`, err);
        }
      }
    });

    await Promise.all([
      this.publisher.connect(),
      this.subscriber.connect()
    ]);

    this.isConnected = true;
    console.log('[RedisPubSub] Connected.');
    for (const [channel, handler] of this.subscriptions) {
      await this.subscriber.subscribe(channel, (message) => {
        handler(message);
      });
    }
  }

  static async publish(channel: string, message: string): Promise<void> {
    if (!this.publisher?.isReady) {
      throw new Error('Redis publisher not connected');
    }
    await this.publisher.publish(channel, message);
  }

  static async subscribe(channel: string, handler: (message: string) => void): Promise<void> {
    if (this.subscriptions.has(channel)) {
      console.warn(`[RedisPubSub] Already subscribed to channel "${channel}"`);
      return;
    }

    this.subscriptions.set(channel, handler);

    if (this.subscriber?.isReady) {
      await this.subscriber.subscribe(channel, (message) => {
        handler(message);
      });
    }
  }

  static async unsubscribe(channel: string): Promise<void> {
    if (this.subscriptions.has(channel)) {
      this.subscriptions.delete(channel);
      if (this.subscriber?.isReady) {
        await this.subscriber.unsubscribe(channel);
      }
    }
  }

  static async disconnect(): Promise<void> {
    const tasks: Promise<any>[] = [];

    if (this.subscriber?.isReady) {
      for (const channel of this.subscriptions.keys()) {
        tasks.push(this.subscriber.unsubscribe(channel));
      }
      tasks.push(this.subscriber.quit());
    }

    if (this.publisher?.isReady) {
      tasks.push(this.publisher.quit());
    }

    await Promise.all(tasks);
    this.publisher = null;
    this.subscriber = null;
    this.isConnected = false;
    this.subscriptions.clear();
    console.log('[RedisPubSub] Disconnected.');
  }
}

import { createClient, RedisClientType } from 'redis';
import { IRedisClient } from '../interface';

export class Redis{
  private static client: RedisClientType | null = null;
  private static ready = false;

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

  static async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      console.log('Redis disconnected');
    }
  }
}

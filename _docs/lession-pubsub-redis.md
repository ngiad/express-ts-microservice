```
# 🧠 Lesson: EventBus với Redis Pub/Sub — Đồng bộ dữ liệu & Invalidate Cache

Trong hệ thống Microservice, việc giữ cho các service đồng bộ dữ liệu và cache là một vấn đề quan trọng. Redis Pub/Sub là một giải pháp nhẹ, đơn giản nhưng hiệu quả để:

- Gửi thông báo khi dữ liệu thay đổi (data change events)
- Invalidate hoặc cập nhật cache trong các service khác
- Đồng bộ trạng thái ứng dụng mà không cần tightly-coupled integration

---

## 📡 Redis Pub/Sub là gì?

Redis Pub/Sub hoạt động theo cơ chế **publish-subscribe**:

- **Publisher** gửi message lên một channel.
- **Subscriber** lắng nghe channel đó để nhận message.
- Redis chỉ làm nhiệm vụ **truyền tin**, không lưu trữ message.

---

## 🔁 Mô hình N-1-N trong hệ thống

### 🌐 Cách hoạt động:

1. **N Service** có thể gửi event khi dữ liệu thay đổi.
2. Một Redis channel (ví dụ: `product-events`) nhận event đó.
3. **N Service khác** đang subscribe sẽ nhận được và thực hiện hành động (ví dụ: invalidate cache).

```
[Service A] --> Redis Pub/Sub --> [Service B]
                               --> [Service C]
                               --> [Service D]
```

Ví dụ thực tế:  
- Service A cập nhật `product`
- Service B, C, D đang cache danh sách sản phẩm → Invalidate hoặc refetch lại khi nhận được `"product-updated"`.

---

## 🧰 Xây dựng Redis EventBus Wrapper

```ts
// event-bus.ts
import { createClient, RedisClientType } from 'redis';

type Handler = (message: any) => void;

export class RedisEventBus {
  private pubClient: RedisClientType;
  private subClient: RedisClientType;
  private handlers: Record<string, Handler[]> = {};

  constructor(redisUrl: string) {
    this.pubClient = createClient({ url: redisUrl });
    this.subClient = createClient({ url: redisUrl });

    this.subClient.on('message', (channel, message) => {
      const parsed = JSON.parse(message);
      this.handlers[channel]?.forEach((handler) => handler(parsed));
    });
  }

  async connect() {
    await this.pubClient.connect();
    await this.subClient.connect();
  }

  async disconnect() {
    await this.pubClient.quit();
    await this.subClient.quit();
  }

  async publish(channel: string, payload: any) {
    await this.pubClient.publish(channel, JSON.stringify(payload));
  }

  async subscribe(channel: string, handler: Handler) {
    if (!this.handlers[channel]) {
      this.handlers[channel] = [];
      await this.subClient.subscribe(channel);
    }
    this.handlers[channel].push(handler);
  }
}
```

---

## 🔥 Ứng dụng thực tế: Invalidate Cache

### 🏗️ Cài đặt EventBus

```ts
// bootstrap.ts
import { RedisEventBus } from './event-bus';

export const eventBus = new RedisEventBus(process.env.REDIS_URL || 'redis://localhost:6379');
await eventBus.connect();
```

---

### 📤 Publish khi dữ liệu thay đổi

```ts
// product-service.ts
import { eventBus } from './bootstrap';

await updateProductInDb(productId, data);
await eventBus.publish('product-events', { type: 'updated', id: productId });
```

---

### 📥 Subscribe và Invalidate Cache

```ts
// cache-listener.ts
import redisCache from './redis-service';
import { eventBus } from './bootstrap';

eventBus.subscribe('product-events', async (event) => {
  if (event.type === 'updated') {
    const cacheKey = `product:${event.id}`;
    await redisCache.del(cacheKey);
    console.log(`🔄 Cache invalidated for key ${cacheKey}`);
  }
});
```


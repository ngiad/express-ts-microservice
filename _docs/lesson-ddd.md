1. **Sơ đồ Architecture tổng quan** (chuẩn clean + scalable microservice)  
2. **Flow đăng nhập chi tiết**  
3. **Folder Structure mapping từng layer rõ ràng**

---

### 1. 🧩 **Sơ đồ Architecture Tổng Quan**

```
┌───────────────────────────────────────┐
│              Entry Point              │
│             (index.ts)                │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│           Transport Layer             │
│   ┌───────────────────────────────┐   │
│   │ HTTP Server (Express / Fastify)│   │
│   │ WebSocket Server (Socket.io)   │   │
│   │ gRPC Server                    │   │
│   └───────────────────────────────┘   │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│           Application Layer           │
│ - Command Handlers                    │
│ - Query Handlers                      │
│ - Services (application service)      │
│ - DTOs / Validators                   │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│               Domain Layer            │
│ - Entities                            │
│ - Value Objects                       │
│ - Aggregates                          │
│ - Domain Services                     │
│ - Interfaces (Repository/Service)     │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│         Infrastructure Layer          │
│ - Repository Implementations (Mongo)  │
│ - Service Implementations (Mailer)    │
│ - Event Bus Publisher/Subscribers     │
└───────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────┐
│               External                │
│ - Database (MongoDB, SQL)             │
│ - Event Bus (Kafka, RabbitMQ)         │
│ - 3rd-party Services (OAuth, Mail)    │
└───────────────────────────────────────┘
```

> ✅ Ưu điểm: bạn tách biệt rõ **lớp Application không biết gì về transport**, **Domain không biết gì về infrastructure**, dễ maintain và scale microservice hoặc monolith đều ổn.

---

### 2. 🔑 **Flow Đăng Nhập**

```
[Client] 
   │ 
   ▼ 
[HTTP POST /login] 
   │ 
   ▼ 
[Transport Layer: Controller] 
   │ 
   ▼ 
[Application Layer: Command Handler] 
   │ Validate input
   │ Call Domain Service: AuthService
   │ 
   ▼ 
[Domain Layer: AuthService] 
   │ Check user credentials
   │ Generate tokens (Access, Refresh)
   │ 
   ▼ 
[Infrastructure Layer: Repository] 
   │ Load user from database
   │ Save refresh token
   │ 
   ▼ 
[Event Bus] (optional) 
   │ Publish "UserLoggedIn" event
   │ 
   ▼ 
[Response to Client] 
   │ Send token + user info
```

---

### 3. 🗂 **Folder Structure Map Từng Layer**

```
src/
├── index.ts                        # Entry point
├── transport/                      # Transport Layer
│   ├── http/
│   │   ├── server.ts
│   │   ├── routes.ts
│   │   └── controllers/
│   │       └── loginController.ts
│   └── websocket/                  # (Optional)
├── application/                    # Application Layer
│   ├── commands/
│   │   └── handleLoginCommand.ts
│   ├── queries/
│   └── services/
├── domain/                         # Domain Layer
│   ├── entities/
│   │   └── User.ts
│   ├── value-objects/
│   ├── services/
│   │   └── AuthService.ts
│   └── interfaces/
│       └── UserRepository.ts
├── infrastructure/                 # Infrastructure Layer
│   ├── database/
│   │   └── MongoUserRepository.ts
│   ├── services/
│   │   └── MailService.ts
│   └── event-bus/
│       └── KafkaPublisher.ts
└── shared/                         # Shared Kernel
    ├── errors/
    └── utils/
```

## 🖼️ **Sơ đồ tổng thể (vẽ đẹp bằng diagram tool)**
### 1. Clean Architecture + Microservice Expandable + Event Bus

```
┌───────────────────────────────────────────────┐
│                   Client (Frontend)           │
└───────────────────────────────────────────────┘
                   │ HTTP / WS / gRPC
                   ▼
┌───────────────────────────────────────────────┐
│              Transport Layer (Application)    │
│   - HTTP Controller                           │
│   - WS Controller                             │
│   - gRPC Controller (Optional)                │
└───────────────────────────────────────────────┘
                   │ Calls
                   ▼
┌───────────────────────────────────────────────┐
│                 Application Layer             │
│   - Service / UseCase                         │
│   - Command / Query Handler                   │
│   - DTOs / Mappers                            │
└───────────────────────────────────────────────┘
                   │ Interface Contract (Port)
                   ▼
┌───────────────────────────────────────────────┐
│                  Domain Layer                 │
│   - Entity                                    │
│   - Aggregate Root                            │
│   - Repository Interface                      │
│   - Domain Service (pure logic)               │
│   - Event Domain                              │
└───────────────────────────────────────────────┘
                   │ Implements
                   ▼
┌───────────────────────────────────────────────┐
│              Infrastructure Layer             │
│   - Repository Implementation                 │
│   - Database (MongoDB, SQL...)                │
│   - External Service (Google, Facebook API)   │
│   - Message Broker (Redis, RabbitMQ, Kafka)   │
└───────────────────────────────────────────────┘
                   │ Event Driven
                   ▼
┌───────────────────────────────────────────────┐
│                  Event Bus / MQ               │
│   - Publish Domain Events                     │
│   - Subscribe Event Listeners                 │
└───────────────────────────────────────────────┘
                   │
                   ▼
┌───────────────────────────────────────────────┐
│                 Other Microservices           │
└───────────────────────────────────────────────┘
```

---

## 🗂️ **Folder structure map**

```
src
├── application
│   ├── services
│   ├── use-cases
│   └── dto
├── domain
│   ├── entities
│   ├── repositories (interface)
│   ├── value-objects
│   └── events
├── infrastructure
│   ├── database
│   │   └── repositories (implementation)
│   ├── services (Google, Facebook, SMTP...)
│   └── event-bus
├── transport
│   ├── http
│   │   ├── controllers
│   │   └── routes
│   └── ws (optional)
├── shared
│   ├── utils
│   └── exceptions
├── server.ts
└── index.ts (Entry point)
```


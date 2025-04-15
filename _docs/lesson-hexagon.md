# Kiến trúc Lục giác (Hexagonal Architecture) - Ports & Adapters

Kiến trúc Lục giác (Hexagonal Architecture), còn được gọi là kiến trúc **Ports and Adapters**, là một mẫu kiến trúc phần mềm được giới thiệu bởi Alistair Cockburn. Mục tiêu chính của nó là tạo ra các ứng dụng **ít phụ thuộc** (loosely coupled), dễ dàng **kiểm thử**, **bảo trì**, và **tiến hóa** độc lập với các thiết bị và công nghệ bên ngoài (như giao diện người dùng, cơ sở dữ liệu, API bên thứ ba).

## Ý tưởng cốt lõi

Ý tưởng trung tâm là tách biệt **lõi ứng dụng** (application core) - nơi chứa logic nghiệp vụ và các quy tắc miền - khỏi các mối quan tâm về **cơ sở hạ tầng** (infrastructure concerns) và **giao diện người dùng** (UI). Lõi ứng dụng giống như một "hình lục giác" (hexagon), và các tương tác với thế giới bên ngoài diễn ra thông qua các "cổng" (ports) trên các mặt của hình lục giác đó.

## Các thành phần chính

Kiến trúc này bao gồm ba thành phần chính:

1.  **Lõi Ứng dụng (Application Core / Hexagon):**
    * Chứa toàn bộ logic nghiệp vụ (business logic), các quy tắc miền (domain rules), và các trường hợp sử dụng (use cases).
    * **Hoàn toàn độc lập** với các công nghệ cụ thể như framework web, cơ sở dữ liệu, hoặc thư viện UI. Nó không biết gì về thế giới bên ngoài ngoài các giao diện (ports) mà nó định nghĩa.

2.  **Cổng (Ports):**
    * Là các **giao diện (interfaces)** được định nghĩa bởi lõi ứng dụng. Chúng đóng vai trò là hợp đồng cho việc tương tác.
    * Có hai loại cổng chính:
        * **Cổng Đầu vào / Cổng Điều khiển (Input/Driving Ports):** Định nghĩa cách thế giới bên ngoài có thể *lái* (drive) hoặc *kích hoạt* ứng dụng. Thường là các API mà lõi ứng dụng phơi bày (ví dụ: giao diện cho các use cases).
        * **Cổng Đầu ra / Cổng Được điều khiển (Output/Driven Ports):** Định nghĩa cách lõi ứng dụng cần tương tác với các hệ thống bên ngoài mà nó *phụ thuộc* vào (ví dụ: giao diện để lưu trữ dữ liệu, gửi thông báo, gọi API bên ngoài).

3.  **Bộ điều hợp (Adapters):**
    * Là các **lớp triển khai cụ thể** kết nối các cổng với các công nghệ hoặc hệ thống bên ngoài. Chúng chịu trách nhiệm **phiên dịch** giữa định dạng/giao thức của thế giới bên ngoài và giao diện của cổng.
    * Tương ứng với hai loại cổng, có hai loại adapter:
        * **Adapter Đầu vào / Điều khiển (Input/Driving Adapters):** Gọi đến các cổng đầu vào. Ví dụ: Web controllers nhận request HTTP và gọi use case thông qua cổng đầu vào; các kịch bản kiểm thử (test scripts); bộ xử lý sự kiện GUI.
        * **Adapter Đầu ra / Được điều khiển (Output/Driven Adapters):** Triển khai các cổng đầu ra. Ví dụ: Lớp Repository giao tiếp với cơ sở dữ liệu SQL/NoSQL; lớp client gửi tin nhắn đến message queue; lớp client gọi REST API của dịch vụ khác.

## Quy tắc Phụ thuộc (Dependency Rule)

**Quan trọng nhất:** Tất cả các phụ thuộc **luôn hướng vào trong**, về phía lõi ứng dụng.
* Các Adapters phụ thuộc vào các Ports (interfaces) của lõi ứng dụng.
* Lõi ứng dụng **không phụ thuộc** vào bất kỳ Adapter nào hay bất kỳ công nghệ cụ thể nào ở lớp ngoài. Nó chỉ biết về các Ports (interfaces) mà chính nó định nghĩa.

```mermaid
graph LR
    subgraph Outside [Thế giới bên ngoài]
        direction LR
        UI(Giao diện người dùng)
        Tests(Kiểm thử tự động)
        API(API Bên ngoài)
        DB(Cơ sở dữ liệu)
        MQ(Message Queue)
    end

    subgraph Hexagon [Lõi ứng dụng (Hexagon)]
        direction TB
        InputPort(Cổng Đầu vào - Use Cases API)
        CoreLogic(Logic nghiệp vụ & Miền)
        OutputPort(Cổng Đầu ra - Repository/Service Interfaces)

        CoreLogic --> InputPort
        CoreLogic --> OutputPort
    end

    subgraph Adapters [Bộ điều hợp (Adapters)]
        direction LR
        DrivingAdapter(Driving Adapters <br/> Controllers, GUI Handlers)
        DrivenAdapter(Driven Adapters <br/> DB Repositories, MQ Clients)
    end

    UI -- Tương tác --> DrivingAdapter
    Tests -- Tương tác --> DrivingAdapter
    DrivingAdapter -- Gọi (Implements) --> InputPort

    OutputPort -- Yêu cầu (Requires) --> DrivenAdapter
    DrivenAdapter -- Giao tiếp --> DB
    DrivenAdapter -- Giao tiếp --> MQ
    DrivenAdapter -- Giao tiếp --> API

    style Hexagon fill:#f9f,stroke:#333,stroke-width:2px




    src/
├── modules/
│   └── user/
│       ├── application/  (Use Cases/Application Services)
│       │   ├── commands/ (Các use case thay đổi trạng thái)
│       │   │   ├── register-user.command.ts
│       │   │   ├── login-user.command.ts
│       │   │   ├── refresh-token.command.ts
│       │   │   ├── handle-oauth-callback.command.ts
│       │   │   ├── logout-user.command.ts
│       │   │   ├── logout-all-devices.command.ts
│       │   │   └── logout-selected-devices.command.ts
│       │   ├── queries/  (Các use case chỉ đọc dữ liệu)
│       │   │   ├── get-user-profile.query.ts
│       │   │   └── get-user-sessions.query.ts
│       │   ├── dto/      (Data Transfer Objects cho use cases)
│       │   │   ├── auth-tokens.dto.ts
│       │   │   ├── user-profile.dto.ts
│       │   │   └── user-session.dto.ts
│       │   ├── services/ (Interfaces - Input Ports)
│       │   │   ├── IAuthService.ts
│       │   │   ├── IOAuthService.ts
│       │   │   └── IUserSessionService.ts
│       │   └── index.ts
│       │
│       ├── domain/       (Core Business Logic & Entities)
│       │   ├── entities/
│       │   │   ├── user.entity.ts
│       │   │   └── user-session.entity.ts (Quan trọng để quản lý device/token)
│       │   ├── repositories/ (Interfaces - Output Ports for Data)
│       │   │   ├── IUserRepository.ts
│       │   │   └── IUserSessionRepository.ts
│       │   ├── services/     (Domain Services - Logic cốt lõi)
│       │   │   ├── IPasswordService.ts
│       │   │   └── ITokenService.ts (Interface cho việc tạo/verify token)
│       │   └── value-objects/ (Optional: e.g., Email, PasswordHash)
│       │
│       └── infrastructure/ (Adapters - Implementation Details)
│           ├── persistence/ (Data Persistence Adapter - Sequelize/MySQL)
│           │   ├── sequelize/
│           │   │   ├── models/
│           │   │   │   ├── user.model.ts
│           │   │   │   └── user-session.model.ts
│           │   │   ├── repositories/
│           │   │   │   ├── sequelize-user.repository.ts
│           │   │   │   └── sequelize-user-session.repository.ts
│           │   │   ├── migrations/
│           │   │   └── config.ts (DB Connection details)
│           │
│           ├── transport/    (Input Adapters - e.g., HTTP Controllers)
│           │   ├── http/     (Ví dụ với Express)
│           │   │   ├── controllers/
│           │   │   │   └── user.controller.ts
│           │   │   ├── dto/  (DTOs cho HTTP layer)
│           │   │   │   ├── register-request.dto.ts
│           │   │   │   ├── login-request.dto.ts
│           │   │   │   └── refresh-token-request.dto.ts
│           │   │   ├── middleware/
│           │   │   │   └── auth.middleware.ts (Kiểm tra Access Token)
│           │   │   └── routes.ts
│           │   └── rpc/      (Nếu cần)
│           │
│           ├── security/     (Security Adapters)
│           │   ├── bcrypt.service.ts (Implement IPasswordService)
│           │   └── jwt.service.ts    (Implement ITokenService)
│           │
│           ├── auth-providers/ (OAuth Adapters)
│           │   ├── google.adapter.ts
│           │   ├── facebook.adapter.ts
│           │   └── IOAuthProvider.ts (Interface chung cho các provider)
│           │
│           └── location/     (Location Service Adapter)
│               └── geoip.service.ts (Implement interface lấy location từ IP)
│
├── config/             (App-wide config)
├── shared/             (Shared utilities, interfaces)
└── main.ts             (App entry point)



mongodb

src/
├── modules/
│   └── user/
│       ├── application/
│       │   ├── commands/
│       │   │   └── login-user.command.ts # (Sẽ được implement trong AuthService)
│       │   ├── dto/
│       │   │   └── auth-tokens.dto.ts
│       │   ├── services/
│       │   │   └── IAuthService.ts
│       │   └── index.ts # Re-export các thành phần Application
│       │
│       ├── domain/
│       │   ├── entities/
│       │   │   ├── user.entity.ts
│       │   │   └── user-session.entity.ts
│       │   ├── repositories/
│       │   │   ├── IUserRepository.ts
│       │   │   └── IUserSessionRepository.ts
│       │   ├── services/
│       │   │   ├── IPasswordService.ts
│       │   │   └── ITokenService.ts
│       │   └── index.ts # Re-export các thành phần Domain
│       │
│       └── infrastructure/
│           ├── persistence/
│           │   └── mongoose/
│           │       ├── schemas/
│           │       │   ├── user.schema.ts
│           │       │   └── user-session.schema.ts
│           │       ├── repositories/
│           │       │   ├── mongoose-user.repository.ts
│           │       │   └── mongoose-user-session.repository.ts
│           │       └── index.ts # Re-export các thành phần Persistence
│           │
│           ├── transport/
│           │   └── http/
│           │       ├── controllers/
│           │       │   └── user.controller.ts
│           │       ├── dto/
│           │       │   └── login-request.dto.ts
│           │       └── index.ts # Re-export các thành phần HTTP Transport
│           │
│           ├── security/
│           │   ├── bcrypt.service.ts
│           │   └── jwt.service.ts
│           │   └── index.ts # Re-export các thành phần Security
│           │
│           └── location/
│               ├── geoip.service.ts
│               └── index.ts # Re-export các thành phần Location
│           └── index.ts # Re-export các thành phần Infrastructure
│
├── config/
├── shared/
└── main.ts


Elasticsearch

├── src/
│   ├── modules/
│   │   └── user/
│   │       ├── application/
│   │       │   ├── commands/
│   │       │   │   ├── register-user.command.ts
│   │       │   │   ├── login-user.command.ts
│   │       │   │   ├── refresh-token.command.ts
│   │       │   │   ├── handle-oauth-callback.command.ts
│   │       │   │   ├── logout-user.command.ts
│   │       │   │   ├── logout-all-devices.command.ts
│   │       │   │   └── logout-selected-devices.command.ts
│   │       │   ├── queries/
│   │       │   │   ├── get-user-profile.query.ts
│   │       │   │   ├── get-user-sessions.query.ts
│   │       │   │   └── search-users.query.ts          // Thêm use case tìm kiếm
│   │       │   ├── dto/
│   │       │   │   ├── auth-tokens.dto.ts
│   │       │   │   ├── user-profile.dto.ts
│   │       │   │   ├── user-session.dto.ts
│   │       │   │   └── user-search-result.dto.ts      // DTO cho kết quả tìm kiếm
│   │       │   ├── services/
│   │       │   │   ├── IAuthService.ts
│   │       │   │   ├── IOAuthService.ts
│   │       │   │   ├── IUserSessionService.ts
│   │       │   │   └── IUserSearchService.ts        // Interface cho dịch vụ tìm kiếm
│   │       │   └── index.ts
│   │       │
│   │       ├── domain/
│   │       │   ├── entities/
│   │       │   │   ├── user.entity.ts
│   │       │   │   └── user-session.entity.ts
│   │       │   ├── repositories/
│   │       │   │   ├── IUserRepository.ts
│   │       │   │   └── IUserSessionRepository.ts
│   │       │   ├── services/
│   │       │   │   ├── IPasswordService.ts
│   │       │   │   └── ITokenService.ts
│   │       │   └── value-objects/
│   │       │
│   │       └── infrastructure/
│   │           ├── persistence/
│   │           │   ├── sequelize/
│   │           │   │   ├── models/
│   │           │   │   │   ├── user.model.ts
│   │           │   │   │   └── user-session.model.ts
│   │           │   │   ├── repositories/
│   │           │   │   │   ├── sequelize-user.repository.ts
│   │           │   │   │   └── sequelize-user-session.repository.ts
│   │           │   │   ├── migrations/
│   │           │   │   └── config.ts
│   │           │
│   │           ├── transport/
│   │           │   ├── http/
│   │           │   │   ├── controllers/
│   │           │   │   │   └── user.controller.ts
│   │           │   │   ├── dto/
│   │           │   │   │   ├── register-request.dto.ts
│   │           │   │   │   ├── login-request.dto.ts
│   │           │   │   │   └── refresh-token-request.dto.ts
│   │           │   │   ├── middleware/
│   │           │   │   │   └── auth.middleware.ts
│   │           │   │   └── routes.ts
│   │           │   └── rpc/
│   │           │
│   │           ├── security/
│   │           │   ├── bcrypt.service.ts
│   │           │   └── jwt.service.ts
│   │           │
│   │           ├── auth-providers/
│   │           │   ├── google.adapter.ts
│   │           │   ├── facebook.adapter.ts
│   │           │   └── IOAuthProvider.ts
│   │           │
│   │           ├── location/
│   │           │   └── geoip.service.ts
│   │           │
│   │           └── search/                      // Thư mục cho search adapter
│   │               └── elasticsearch-user-search.service.ts // Adapter Elasticsearch
│   │
│   └── index.ts                                 // (Nếu có các exports chung cho modules)
│
├── config/
│   └── elasticsearch.config.ts                // Cấu hình Elasticsearch
├── shared/
│   ├── interfaces/
│   │   └── ...
│   ├── dtos/
│   │   └── ...
│   ├── services/
│   │   └── ...
│   └── utils/
│       └── ...
├── main.ts
├── package.json
├── package-lock.json
└── README.md


kiến trúc DDD kết hợp clean architecture

├── transport
│   ├── http
│   │   ├── controllers
│   │   ├── routes
│   │   ├── middlewares
│   │   └── server.ts  # Khởi tạo HTTP server (Express / Fastify)
├── application
│   ├── commands
│   ├── queries
│   ├── services
│   └── ...
├── domain
│   ├── entities
│   ├── repositories (interface)
│   └── ...
├── infrastructure
│   ├── persistence
│   │   ├── sequelize
│   │   └── mongo
│   ├── auth-providers
│   ├── mail-service
│   └── logger
├── security
├── utils
└── index.ts # Entry point: chỉ import transport layer

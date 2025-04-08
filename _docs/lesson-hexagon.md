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
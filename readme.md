# Dự án E-commerce Microservice (Node.js, Express, TypeScript)

Đây là một microservice được xây dựng cho nền tảng thương mại điện tử, **tuân theo kiến trúc Hexagonal (Ports and Adapters)**, và sử dụng ngăn xếp công nghệ hiện đại bao gồm Node.js, Express.js và TypeScript. Dự án sử dụng MySQL làm cơ sở dữ liệu với Sequelize ORM để tương tác và Zod để xác thực dữ liệu đầu vào một cách hiệu quả và an toàn.

## Công nghệ sử dụng

* **Backend Framework:** Express.js
* **Ngôn ngữ:** TypeScript
* **Runtime:** Node.js
* **Cơ sở dữ liệu:** MySQL
* **ORM:** Sequelize
* **Xác thực dữ liệu (Validation):** Zod
* **Quản lý biến môi trường:** dotenv
* **Containerization (CSDL):** Docker
* **Dev Tools:** Nodemon, ts-node

## Kiến trúc (Architecture)

Dự án này áp dụng kiến trúc **Hexagonal (hay Ports and Adapters)**. Mục tiêu chính của kiến trúc này là:

* **Tách biệt logic nghiệp vụ cốt lõi (Domain & Application Core):** Giữ cho phần xử lý nghiệp vụ không phụ thuộc trực tiếp vào các chi tiết kỹ thuật bên ngoài như framework web, cơ sở dữ liệu, hay các dịch vụ của bên thứ ba.
* **Tăng khả năng kiểm thử (Testability):** Logic nghiệp vụ có thể được kiểm thử độc lập mà không cần khởi tạo toàn bộ ứng dụng hay cơ sở dữ liệu.
* **Linh hoạt và dễ thay thế:** Dễ dàng thay đổi hoặc thay thế các thành phần bên ngoài (ví dụ: đổi cơ sở dữ liệu, thay đổi framework web) mà ít ảnh hưởng đến phần lõi nghiệp vụ.

Kiến trúc này được thực hiện thông qua việc định nghĩa rõ ràng các **Ports** (là các interface hoặc abstract class định nghĩa cách tương tác với lõi ứng dụng) và các **Adapters** (là các thành phần triển khai cụ thể các port đó để kết nối với công nghệ cụ thể - ví dụ: Express adapter, Sequelize adapter).

## Yêu cầu hệ thống

* Node.js (khuyến nghị phiên bản 18.x trở lên)
* npm hoặc yarn
* Docker (để chạy cơ sở dữ liệu MySQL)

## Hướng dẫn cài đặt và Khởi chạy

1.  **Clone repository:**
    ```bash
    git clone https://github.com/ngiad/express-ts-microservice.git
    cd express-ts-microservice
    ```

2.  **Cài đặt dependencies:**
    ```bash
    npm install
    # hoặc
    yarn install
    ```

3.  **Khởi tạo Cơ sở dữ liệu MySQL bằng Docker:**
    Chạy lệnh sau trong terminal để tạo và chạy một container MySQL với cấu hình cần thiết:
    ```bash
    docker run -d --name mysql-ecommerce -e MYSQL_ROOT_PASSWORD="your_password" -e MYSQL_USER="demo" -e MYSQL_PASSWORD="your_password" -e MYSQL_DATABASE="demo" -p 3309:3306 bitnami/mysql:8.0
    ```
    * Lệnh này sẽ tạo một container tên là `mysql-ecommerce`.
    * Cơ sở dữ liệu `demo` sẽ được tạo với user `demo` và password `your_password`. **Hãy thay `your_password` bằng một mật khẩu an toàn của bạn.**
    * Cổng `3306` của container MySQL sẽ được ánh xạ tới cổng `3309` trên máy host của bạn.
    * Bạn có thể thay đổi mật khẩu hoặc tên nếu muốn, nhưng nhớ cập nhật trong file `.env`.

4.  **Cấu hình Biến môi trường:**
    * Tạo một file tên là `.env` trong thư mục gốc của dự án.

    ```env
    # Cấu hình Server
    PORT=8080 # Hoặc cổng bạn muốn chạy ứng dụng

    # Cấu hình Kết nối Cơ sở dữ liệu MySQL
    DB_HOST=localhost
    DB_PORT=3309 # Cổng ánh xạ trên máy host (từ lệnh docker)
    DB_USERNAME=demo
    DB_PASSWORD=your_password # !! Thay bằng mật khẩu bạn đã đặt ở bước 3
    DB_DATABASE=demo
    DB_DIALECT=mysql

    # Các biến môi trường khác (nếu có)
    # JWT_SECRET=...
    ```
    * **Quan trọng:** Đảm bảo các thông tin kết nối CSDL trong file `.env` khớp với cấu hình khi bạn chạy container Docker (đặc biệt là `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`).
    
5.  **Khởi động dự án (Development Mode):**
    Chạy lệnh sau để khởi động server với Nodemon (tự động khởi động lại khi có thay đổi code):
    ```bash
    npm start
    ```
    Server sẽ chạy trên cổng được định nghĩa trong file `.env` (ví dụ: `http://localhost:8080`).

## Scripts có sẵn

Trong file `package.json`, script chính là:

* `npm start`: Khởi chạy ứng dụng ở chế độ development sử dụng `nodemon` và `ts-node`.
* `npm test`: (Hiện tại chưa có test) - Cần được cấu hình thêm.

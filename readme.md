# Dự án E-commerce Microservice (Node.js, Express, TypeScript)

Đây là một microservice được xây dựng cho nền tảng thương mại điện tử, sử dụng ngăn xếp công nghệ hiện đại bao gồm Node.js, Express.js và TypeScript. Dự án sử dụng MySQL làm cơ sở dữ liệu với Sequelize ORM để tương tác và Zod để xác thực dữ liệu đầu vào một cách hiệu quả và an toàn.

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

## Yêu cầu hệ thống

* Node.js (khuyến nghị phiên bản 18.x trở lên)
* npm hoặc yarn
* Docker (để chạy cơ sở dữ liệu MySQL)

## Hướng dẫn cài đặt và Khởi chạy

1.  **Clone repository:**
    ```bash
    git clone <URL_repository_của_bạn>
    cd <tên_thư_mục_dự_án>
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
    * Cơ sở dữ liệu `demo` sẽ được tạo với user `demo` và password `your_password`.
    * Cổng `3306` của container MySQL sẽ được ánh xạ tới cổng `3309` trên máy host của bạn.
    * Bạn có thể thay đổi mật khẩu hoặc tên nếu muốn, nhưng nhớ cập nhật trong file `.env`.

4.  **Cấu hình Biến môi trường:**
    * Tạo một file tên là `.env` trong thư mục gốc của dự án.
    * Sao chép nội dung từ file `.env.example` (nếu có) hoặc thêm các biến sau vào file `.env`:

    ```env
    # Cấu hình Server
    PORT=8080 # Hoặc cổng bạn muốn chạy ứng dụng

    # Cấu hình Kết nối Cơ sở dữ liệu MySQL
    DB_HOST=localhost
    DB_PORT=3309 # Cổng ánh xạ trên máy host (từ lệnh docker)
    DB_USERNAME=demo
    DB_PASSWORD=ecommerce
    DB_DATABASE=demo
    DB_DIALECT=mysql
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

## Giấy phép

Dự án này được cấp phép theo Giấy phép ISC. Xem file `LICENSE` để biết chi tiết (nếu có).
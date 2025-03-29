import { config } from "dotenv";
import { Sequelize } from "sequelize";


config()

// Khởi tạo đối tượng Sequelize để kết nối với cơ sở dữ liệu MySQL
export const sequelize = new Sequelize({
    // Tên cơ sở dữ liệu, lấy từ biến môi trường hoặc để trống nếu không có
    database: process.env.DB_NAME || "",  

    // Tên người dùng cơ sở dữ liệu, lấy từ biến môi trường
    username: process.env.DB_USERNAME || "",  

    // Mật khẩu để kết nối với cơ sở dữ liệu
    password: process.env.DB_PASSWORD || "",  

    // Địa chỉ máy chủ (host) của cơ sở dữ liệu
    host: process.env.DB_HOST || "",  

    // Cổng kết nối đến cơ sở dữ liệu (chuyển từ chuỗi sang số)
    port: parseInt(process.env.DB_PORT as string),  

    // Loại cơ sở dữ liệu (ở đây là MySQL)
    dialect: "mysql",  

    // Cấu hình connection pool để tối ưu hiệu suất kết nối đến DB
    pool: {
        max: 20,        // Số kết nối tối đa trong pool
        min: 2,         // Số kết nối tối thiểu trong pool
        acquire: 30000, // Thời gian tối đa (ms) để lấy kết nối trước khi báo lỗi
        idle: 60000,    // Thời gian tối đa (ms) một kết nối có thể nhàn rỗi trước khi bị đóng
    },

    // Bật chế độ ghi log truy vấn SQL (true: bật, false: tắt)
    logging: false,  
});

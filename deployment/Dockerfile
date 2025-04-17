# Chọn phiên bản Node.js 20 (Alpine cho dung lượng nhỏ hơn)
FROM node:20-alpine

# Đặt thư mục làm việc bên trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn của dự án vào thư mục làm việc
COPY . .

# (Không cần build nếu dùng nodemon với ts-node trực tiếp)
# RUN npm run build # Nếu bạn có bước build TypeScript riêng

# Cổng mà ứng dụng Express sẽ lắng nghe bên trong container (thay đổi thành 3321)
EXPOSE 3321

# Lệnh để chạy ứng dụng khi container khởi động (sử dụng script từ package.json)
CMD ["npm", "start"]
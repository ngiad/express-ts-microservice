Okay, đây là nội dung cho file `lesson-sequelize.md` giới thiệu về Sequelize, được viết bằng tiếng Việt theo định dạng Markdown.

```markdown
# Bài học: Giới thiệu về Sequelize

## Mục tiêu bài học

* Hiểu khái niệm ORM (Object-Relational Mapping).
* Biết Sequelize là gì và tại sao nên sử dụng nó trong các dự án Node.js.
* Cài đặt và cấu hình Sequelize để kết nối với cơ sở dữ liệu.
* Định nghĩa Models để ánh xạ bảng trong cơ sở dữ liệu.
* Thực hiện các thao tác CRUD (Create, Read, Update, Delete) cơ bản.
* Hiểu về Associations (Quan hệ) giữa các Models.
* Sử dụng Migrations để quản lý thay đổi schema cơ sở dữ liệu.
* Sử dụng Seeders để tạo dữ liệu mẫu.

## 1. ORM và Sequelize là gì?

### ORM (Object-Relational Mapping)

ORM là một kỹ thuật lập trình cho phép chuyển đổi dữ liệu giữa các hệ thống không tương thích (như cơ sở dữ liệu quan hệ) và các ngôn ngữ lập trình hướng đối tượng (như JavaScript). Thay vì viết các câu lệnh SQL phức tạp, bạn có thể tương tác với cơ sở dữ liệu thông qua các đối tượng và phương thức trong ngôn ngữ lập trình của mình.

**Lợi ích của ORM:**

* **Tăng năng suất:** Viết ít code hơn, tập trung vào logic nghiệp vụ.
* **Trừu tượng hóa CSDL:** Dễ dàng chuyển đổi giữa các hệ quản trị CSDL khác nhau (ví dụ: từ PostgreSQL sang MySQL) mà ít phải thay đổi code.
* **Bảo mật:** Giảm nguy cơ tấn công SQL Injection nếu sử dụng đúng cách.
* **Dễ bảo trì:** Code thường dễ đọc và dễ hiểu hơn so với SQL thuần.

### Sequelize

**Sequelize** là một ORM dựa trên Promise cho Node.js. Nó hỗ trợ các hệ quản trị cơ sở dữ liệu quan hệ phổ biến như:

* PostgreSQL
* MySQL
* MariaDB
* SQLite
* Microsoft SQL Server

Sequelize cung cấp các tính năng mạnh mẽ như:

* Hỗ trợ Transaction (giao dịch).
* Quản lý Quan hệ (Relations): One-to-One, One-to-Many, Many-to-Many.
* Migrations để quản lý schema CSDL.
* Seeders để khởi tạo dữ liệu.
* Validation (kiểm tra dữ liệu).
* Hooks (các hàm chạy tại các thời điểm nhất định trong vòng đời của model).
* Eager và Lazy Loading (tải dữ liệu liên quan).

## 2. Yêu cầu

* Node.js và npm (hoặc yarn) đã được cài đặt.
* Kiến thức cơ bản về JavaScript (ES6+).
* Kiến thức cơ bản về cơ sở dữ liệu quan hệ và SQL.
* Một hệ quản trị CSDL đã được cài đặt và đang chạy (ví dụ: PostgreSQL, MySQL, SQLite).

## 3. Cài đặt

Mở terminal trong thư mục dự án của bạn và chạy lệnh sau:

```bash
npm install sequelize
# hoặc
yarn add sequelize
```

Bạn cũng cần cài đặt driver tương ứng với cơ sở dữ liệu bạn đang sử dụng:

* **PostgreSQL:** `npm install pg pg-hstore` (hoặc `yarn add pg pg-hstore`)
* **MySQL:** `npm install mysql2` (hoặc `yarn add mysql2`)
* **MariaDB:** `npm install mariadb` (hoặc `yarn add mariadb`)
* **SQLite:** `npm install sqlite3` (hoặc `yarn add sqlite3`)
* **Microsoft SQL Server:** `npm install tedious` (hoặc `yarn add tedious`)

Để sử dụng Migrations và Seeders, bạn nên cài đặt `sequelize-cli`:

```bash
npm install --save-dev sequelize-cli
# hoặc
yarn add --dev sequelize-cli
```

Sau đó, khởi tạo cấu trúc thư mục cho Sequelize CLI:

```bash
npx sequelize-cli init
```

Lệnh này sẽ tạo ra các thư mục: `config`, `migrations`, `models`, `seeders` và file `config/config.json` để cấu hình kết nối.

## 4. Kết nối Cơ sở dữ liệu

Bạn cần tạo một instance của Sequelize để kết nối đến CSDL. Thông thường, việc này được thực hiện trong một file riêng (ví dụ: `db.js` hoặc `models/index.js`).

```javascript
// db.js hoặc tương tự
const { Sequelize } = require('sequelize');

// Thay thế bằng thông tin kết nối của bạn
// Nên sử dụng biến môi trường (environment variables) trong thực tế
const sequelize = new Sequelize('database_name', 'username', 'password', {
  host: 'localhost', // hoặc địa chỉ host CSDL
  dialect: 'postgres', // ví dụ: 'mysql', 'sqlite', 'mssql'
  logging: false, // Tắt log SQL ra console, hoặc console.log để xem
  // Các tùy chọn khác...
});

// Kiểm tra kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Kết nối CSDL thành công.');
  } catch (error) {
    console.error('Không thể kết nối đến CSDL:', error);
  }
}

testConnection();

module.exports = sequelize;
```

**Lưu ý:** Sử dụng file `config/config.json` khi dùng `sequelize-cli` sẽ tiện lợi hơn cho việc quản lý cấu hình theo môi trường (development, test, production).

## 5. Định nghĩa Models

Model trong Sequelize đại diện cho một bảng trong cơ sở dữ liệu. Mỗi instance của model tương ứng với một hàng trong bảng đó.

Bạn có thể định nghĩa model bằng cách sử dụng `sequelize.define('modelName', attributes, options)`.

```javascript
// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Import instance sequelize đã tạo

const User = sequelize.define('User', {
  // Các thuộc tính (cột trong bảng)
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false, // Không cho phép giá trị NULL
  },
  lastName: {
    type: DataTypes.STRING,
    // allowNull mặc định là true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Đảm bảo email là duy nhất
    validate: {
      isEmail: true, // Sử dụng validator có sẵn
    }
  },
  // Sequelize tự động thêm các cột createdAt và updatedAt
  // Bạn có thể tắt bằng cách thêm { timestamps: false } vào options
}, {
  // Các tùy chọn khác cho model
  tableName: 'users', // Tên bảng trong CSDL (mặc định là dạng số nhiều của tên model)
  // timestamps: false, // Nếu không muốn cột createdAt, updatedAt
});

// Đồng bộ model với CSDL (thường chỉ dùng trong development)
// Trong production, nên dùng Migrations
// async function syncDb() {
//   await User.sync({ alter: true }); // alter: true sẽ cố gắng cập nhật bảng nếu có thay đổi
//   console.log("Bảng User đã được đồng bộ.");
// }
// syncDb();

module.exports = User;
```

**Các kiểu dữ liệu (DataTypes) phổ biến:**

* `DataTypes.STRING`: VARCHAR(255)
* `DataTypes.TEXT`: TEXT
* `DataTypes.INTEGER`: INTEGER
* `DataTypes.BIGINT`: BIGINT
* `DataTypes.FLOAT`: FLOAT
* `DataTypes.DOUBLE`: DOUBLE
* `DataTypes.DECIMAL`: DECIMAL
* `DataTypes.BOOLEAN`: BOOLEAN
* `DataTypes.DATE`: DATETIME (cho MySQL/MariaDB/SQLite), TIMESTAMP WITH TIME ZONE (cho PostgreSQL)
* `DataTypes.UUID`: UUID
* `DataTypes.JSON`: JSON (PostgreSQL, MySQL, SQLite)

## 6. Thao tác CRUD cơ bản

Sequelize cung cấp các phương thức dễ sử dụng để thực hiện các thao tác CRUD.

```javascript
const User = require('./models/User'); // Giả sử User model đã được định nghĩa

// --- CREATE (Tạo mới) ---
async function createUser() {
  try {
    const newUser = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: '[đã xoá địa chỉ email]'
    });
    console.log('User mới đã được tạo:', newUser.toJSON());
    return newUser;
  } catch (error) {
    console.error('Lỗi khi tạo user:', error);
  }
}

// --- READ (Đọc dữ liệu) ---

// Tìm tất cả users
async function findAllUsers() {
  try {
    const users = await User.findAll({
      // where: { firstName: 'John' }, // Điều kiện lọc
      // attributes: ['firstName', 'email'] // Chỉ lấy các cột cụ thể
    });
    console.log('Tất cả users:', JSON.stringify(users, null, 2));
    return users;
  } catch (error) {
    console.error('Lỗi khi tìm users:', error);
  }
}

// Tìm một user theo Primary Key (ID)
async function findUserById(id) {
  try {
    const user = await User.findByPk(id);
    if (user) {
      console.log('Tìm thấy user:', user.toJSON());
    } else {
      console.log('Không tìm thấy user với ID:', id);
    }
    return user;
  } catch (error) {
    console.error('Lỗi khi tìm user:', error);
  }
}

// Tìm một user theo điều kiện khác
async function findOneUser() {
    try {
      const user = await User.findOne({ where: { email: '[đã xoá địa chỉ email]' } });
      if (user) {
        console.log('Tìm thấy user theo email:', user.toJSON());
      } else {
        console.log('Không tìm thấy user.');
      }
      return user;
    } catch (error) {
      console.error('Lỗi khi tìm user:', error);
    }
  }

// --- UPDATE (Cập nhật) ---
async function updateUser(id) {
  try {
    // Cách 1: Tìm rồi cập nhật instance
    const user = await User.findByPk(id);
    if (user) {
      user.lastName = 'Smith'; // Thay đổi giá trị
      await user.save(); // Lưu thay đổi vào CSDL
      console.log('User đã được cập nhật (cách 1):', user.toJSON());
    }

    // Cách 2: Cập nhật trực tiếp bằng phương thức update
    const [numberOfAffectedRows] = await User.update(
      { lastName: 'Jones' }, // Dữ liệu cần cập nhật
      { where: { id: id } } // Điều kiện
    );
    if (numberOfAffectedRows > 0) {
        console.log(`Đã cập nhật ${numberOfAffectedRows} user (cách 2).`);
    } else {
        console.log('Không có user nào được cập nhật (cách 2).');
    }
    return numberOfAffectedRows;
  } catch (error) {
    console.error('Lỗi khi cập nhật user:', error);
  }
}

// --- DELETE (Xóa) ---
async function deleteUser(id) {
  try {
    // Cách 1: Tìm rồi xóa instance
    const user = await User.findByPk(id);
    if (user) {
      await user.destroy();
      console.log('User đã được xóa (cách 1).');
    }

    // Cách 2: Xóa trực tiếp bằng phương thức destroy
    const numberOfDestroyedRows = await User.destroy({
      where: { id: id } // Điều kiện
    });
     if (numberOfDestroyedRows > 0) {
        console.log(`Đã xóa ${numberOfDestroyedRows} user (cách 2).`);
    } else {
        console.log('Không có user nào bị xóa (cách 2).');
    }
    return numberOfDestroyedRows;
  } catch (error) {
    console.error('Lỗi khi xóa user:', error);
  }
}

// Ví dụ chạy các hàm
async function runDemo() {
    const newUser = await createUser();
    if (newUser) {
        await findAllUsers();
        await findUserById(newUser.id);
        await updateUser(newUser.id);
        await deleteUser(newUser.id);
        await findAllUsers(); // Kiểm tra lại sau khi xóa
    }
}

// runDemo();
```

## 7. Associations (Quan hệ)

Sequelize cho phép định nghĩa các mối quan hệ giữa các model:

* **`hasOne` (Một-Một):** Ví dụ: Một `User` có một `Profile`.
* **`belongsTo` (Một-Một / Nhiều-Một):** Ví dụ: Một `Profile` thuộc về một `User`. Một `Post` thuộc về một `User`.
* **`hasMany` (Một-Nhiều):** Ví dụ: Một `User` có nhiều `Post`.
* **`belongsToMany` (Nhiều-Nhiều):** Ví dụ: Một `Post` có thể có nhiều `Tag`, và một `Tag` có thể thuộc về nhiều `Post`. Cần một bảng trung gian.

**Ví dụ: User và Post (Một-Nhiều)**

```javascript
// models/User.js (thêm vào cuối file)
// ... định nghĩa User model ...
// module.exports = User; // Tạm thời comment dòng này nếu Post ở file khác

// models/Post.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Post = sequelize.define('Post', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
  },
  // userId sẽ được Sequelize tự động thêm vào khi định nghĩa association
});

// module.exports = Post; // Tạm thời comment dòng này

// --- Định nghĩa quan hệ ---
// Trong file quản lý models (ví dụ models/index.js) hoặc sau khi định nghĩa cả 2 models

const User = require('./User'); // Hoặc import từ nơi định nghĩa User
const Post = require('./Post'); // Hoặc import từ nơi định nghĩa Post

// Một User có nhiều Post (One-to-Many)
User.hasMany(Post, {
    foreignKey: 'userId' // Tên khóa ngoại trong bảng Post
});
// Một Post thuộc về một User (Many-to-One)
Post.belongsTo(User, {
    foreignKey: 'userId' // Tên khóa ngoại trong bảng Post
});

// Export các models đã định nghĩa quan hệ
// module.exports = { User, Post, sequelize };
```

Khi đã định nghĩa quan hệ, bạn có thể dễ dàng truy vấn dữ liệu liên quan bằng tùy chọn `include`:

```javascript
async function findUserWithPosts(userId) {
  const userWithPosts = await User.findByPk(userId, {
    include: Post // Bao gồm tất cả các Post liên quan
    // Hoặc chi tiết hơn: include: [{ model: Post, where: { ... } }]
  });
  console.log(JSON.stringify(userWithPosts, null, 2));
}

async function findPostWithUser(postId) {
    const postWithUser = await Post.findByPk(postId, {
        include: User // Bao gồm User liên quan
    });
    console.log(JSON.stringify(postWithUser, null, 2));
}
```

## 8. Migrations

Migrations là cách tốt nhất để quản lý các thay đổi đối với schema cơ sở dữ liệu của bạn một cách nhất quán và có kiểm soát, đặc biệt là trong môi trường làm việc nhóm hoặc khi triển khai ứng dụng. `sequelize-cli` giúp tạo và quản lý migrations.

**Các lệnh cơ bản:**

* **Tạo migration mới:**
    ```bash
    npx sequelize-cli migration:generate --name <tên-migration-mô-tả>
    # Ví dụ: npx sequelize-cli migration:generate --name create-user-table
    ```
    Lệnh này tạo một file trong thư mục `migrations`. File này chứa hai hàm: `up` (áp dụng thay đổi) và `down` (hoàn tác thay đổi).

* **Chạy migrations:**
    ```bash
    npx sequelize-cli db:migrate
    ```
    Lệnh này sẽ chạy tất cả các migration chưa được áp dụng (hàm `up`). Sequelize theo dõi các migration đã chạy trong một bảng đặc biệt tên là `SequelizeMeta`.

* **Hoàn tác migration gần nhất:**
    ```bash
    npx sequelize-cli db:migrate:undo
    ```

* **Hoàn tác tất cả migrations:**
    ```bash
    npx sequelize-cli db:migrate:undo:all
    ```

**Ví dụ file migration (tạo bảng users):**

```javascript
// migrations/YYYYMMDDHHMMSS-create-user-table.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // queryInterface cung cấp các phương thức để thay đổi CSDL
    await queryInterface.createTable('users', { // Tên bảng
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Hàm down để hoàn tác những gì hàm up đã làm
    await queryInterface.dropTable('users');
  }
};
```

## 9. Seeders

Seeders dùng để chèn dữ liệu mẫu (seed data) vào cơ sở dữ liệu. Điều này rất hữu ích cho việc phát triển, kiểm thử hoặc khởi tạo dữ liệu ban đầu cho ứng dụng.

**Các lệnh cơ bản:**

* **Tạo seeder mới:**
    ```bash
    npx sequelize-cli seed:generate --name <tên-seeder-mô-tả>
    # Ví dụ: npx sequelize-cli seed:generate --name sample-users
    ```
    Tạo file trong thư mục `seeders` với cấu trúc tương tự migration (`up` và `down`).

* **Chạy tất cả seeders:**
    ```bash
    npx sequelize-cli db:seed:all
    ```
    Thực thi hàm `up` của tất cả các file seeder.

* **Hoàn tác seeder gần nhất:** (Cần định nghĩa hàm `down` cẩn thận)
    ```bash
    npx sequelize-cli db:seed:undo
    ```

* **Hoàn tác tất cả seeders:**
    ```bash
    npx sequelize-cli db:seed:undo:all
    ```

**Ví dụ file seeder (tạo user mẫu):**

```javascript
// seeders/YYYYMMDDHHMMSS-sample-users.js
'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // queryInterface.bulkInsert chèn nhiều bản ghi cùng lúc
    await queryInterface.bulkInsert('users', [ // Tên bảng
      {
        firstName: 'Alice',
        lastName: 'Wonder',
        email: '[đã xoá địa chỉ email]',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstName: 'Bob',
        lastName: 'Builder',
        email: '[đã xoá địa chỉ email]',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {}); // Tham số thứ 3 là options (ít dùng cho insert)
  },

  async down(queryInterface, Sequelize) {
    // Hàm down để xóa dữ liệu đã được hàm up chèn vào
    // Cần cẩn thận với điều kiện xóa để không xóa nhầm dữ liệu khác
    await queryInterface.bulkDelete('users', {
        email: ['[đã xoá địa chỉ email]', '[đã xoá địa chỉ email]'] // Xóa theo điều kiện
    }, {});
    // Hoặc đơn giản hơn nhưng nguy hiểm hơn nếu bảng có dữ liệu khác:
    // await queryInterface.bulkDelete('users', null, {});
  }
};
```

## 10. Các khái niệm nâng cao (Giới thiệu)

* **Truy vấn nâng cao:** Sử dụng các toán tử (`Op.gt`, `Op.like`, `Op.in`, ...), sắp xếp (`order`), phân trang (`limit`, `offset`), nhóm (`group`), hàm tổng hợp (`fn`, `col`), bao gồm dữ liệu liên quan với điều kiện phức tạp (`include`).
* **Hooks:** Các hàm được thực thi tự động trước hoặc sau các sự kiện nhất định của model (ví dụ: `beforeCreate`, `afterUpdate`, `beforeValidate`). Hữu ích để mã hóa mật khẩu, cập nhật các trường liên quan, v.v.
* **Transactions:** Đảm bảo một loạt các thao tác CSDL được thực hiện thành công hoàn toàn hoặc không thực hiện gì cả (tính nguyên tử - atomicity), giúp duy trì tính nhất quán của dữ liệu. Sử dụng `sequelize.transaction()`.
* **Scopes:** Định nghĩa các tập hợp truy vấn thường dùng cho model để tái sử dụng.
* **Paranoid Tables (Soft Deletes):** Thêm cột `deletedAt`. Khi xóa bản ghi, cột này được cập nhật thay vì xóa hẳn khỏi CSDL.

## 11. Kết luận

Sequelize là một ORM mạnh mẽ và linh hoạt cho Node.js, giúp đơn giản hóa việc tương tác với cơ sở dữ liệu quan hệ. Bằng cách sử dụng Models, Associations, Migrations và Seeders, bạn có thể xây dựng các ứng dụng có cấu trúc tốt, dễ bảo trì và mở rộng.

Hãy tiếp tục khám phá tài liệu chính thức của Sequelize để tìm hiểu sâu hơn về các tính năng nâng cao và các tùy chọn cấu hình khác.

## 12. Tài liệu tham khảo

* **Sequelize Official Documentation:** [https://sequelize.org/](https://sequelize.org/)

```

Bạn có thể sao chép nội dung này và lưu vào file `lesson-sequelize.md`. Nội dung này bao gồm các phần chính từ giới thiệu, cài đặt, CRUD cơ bản đến các khái niệm quan trọng như associations, migrations và seeders, cùng với ví dụ code minh họa.
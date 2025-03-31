import { DataTypes, Model, Sequelize } from "sequelize";
import { CategoryStatus } from "../../model";

export class CategoryPersistence extends Model {
    declare id: string;
    declare name: string;
    declare image?: string;
    declare parentId?: string;
    declare description?: string;
    declare status: CategoryStatus;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

export const modelName = "Category"

// export function init(sequelize : Sequelize){
//     CategoryPersistence.init({
//         id : {
//             type : DataTypes.STRING,
//             primaryKey : true
//         },
//         name : {
//             type : DataTypes.STRING,
//             allowNull : false,
//         },
//         image : {
//             type : DataTypes.STRING,
//             allowNull : true,
//         },
//         parentId : {
//             type : DataTypes.STRING,
//             field : "parent_id",
//             allowNull : true,
//         },
//         description : {
//             type : DataTypes.STRING,
//             allowNull : true,
//         },
//         status : {
//             type : DataTypes.ENUM("active","inactive","deleted"),
//             allowNull : false,
//             defaultValue : "active"
//         }
//     },{
//         sequelize, // Kết nối Sequelize cần được truyền vào
//         modelName, // Tên của model (Category)
//         tableName: "categories", // Tên bảng trong cơ sở dữ liệu (tuỳ chọn)
//         timestamps: true, // Tự động thêm createdAt, updatedAt (nếu cần)
//         createdAt: "created_at",
//         updatedAt: "updated_at",
//     })
// }

export function init(sequelize: Sequelize) {
    CategoryPersistence.init(
      {
        id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        parentId: {
          type: DataTypes.STRING,
          field: "parent_id",
          allowNull: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("active", "inactive", "deleted"),
          allowNull: false,
          defaultValue: "active",
        },
        createdAt: {
          type: DataTypes.DATE,
          field: "created_at", 
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: "updated_at", 
        },
      },
      {
        sequelize,
        modelName,
        tableName: "categories",
        timestamps: true, 
      }
    );
  }
  
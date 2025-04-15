import { DataTypes, Model, Sequelize } from "sequelize";

export class CartItem extends Model {
  public id!: string;
  public userId!: string;
  public branchId!: string;
  public productId!: string;
  public attributes!: string;
  public quantity!: number;
  public product!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const modelCartName = "carts";

export function initCartItemModel(sequelize: Sequelize) {
  CartItem.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "user_id",
      },
      branchId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "branch_id",
      },
      productId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "product_id",
      },
      attributes: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      tableName: "carts",
      modelName: modelCartName,
      timestamps: true,
      underscored: true,
    }
  );

  return CartItem;
}

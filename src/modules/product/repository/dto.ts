import { DataTypes, Model, Sequelize } from "sequelize";

export const modelProductName = "product";

export class ProductPersistence extends Model {
  declare id: string;
  declare name: string;
  declare image?: string | null;
  declare description?: string | null;
  declare location?: string;
  declare tagLine?: string | null;
  declare status:
    | "active"
    | "inactive"
    | "deleted"
    | "banner"
    | "featured"
    | "best-seller"
    | "new-arrival"
    | "on-sale"
    | "trending"
    | "recommended";
  declare createdAt: Date;
  declare updatedAt: Date;
  declare branchId?: string;
  declare categoryId?: string;
  declare price?: number;
  declare discount?: number;
  declare stock?: number;
  declare rating?: number;
  declare isFeatured?: boolean;
  declare isBestSeller?: boolean;
  declare isNewArrival?: boolean;
  declare isOnSale?: boolean;
  declare isTrending?: boolean;
  declare isRecommended?: boolean;
  declare isPopular?: boolean;
  declare isLimitedEdition?: boolean;
}

export const init = (sequelize: Sequelize) => {
  ProductPersistence.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tagLine: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM(
          "active",
          "inactive",
          "deleted",
          "banner",
          "featured",
          "best-seller",
          "new-arrival",
          "on-sale",
          "trending",
          "recommended"
        ),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      branchId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      discount: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isBestSeller: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isNewArrival: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isOnSale: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isTrending: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isRecommended: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isPopular: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      isLimitedEdition: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "products",
      timestamps: true,
      modelName: modelProductName,
    }
  );
};

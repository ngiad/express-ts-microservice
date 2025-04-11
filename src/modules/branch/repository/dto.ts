// có thể để tên là model
import { DataTypes, Model, Sequelize } from "sequelize";

export class BranchPersistence extends Model {
    declare id: string;
    declare name: string;
    declare image?: string | null;
    declare description?: string;
    declare location?: string;
    declare tagLine?: string | null;
    declare status: "active" | "inactive" | "deleted" | "banner" | "featured";
    declare createdAt: Date;
    declare updatedAt: Date;
}

export const modelBranchName = "branch";

export function init(sequelize: Sequelize) {
    BranchPersistence.init(
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
                type: DataTypes.ENUM("active", "inactive", "deleted", "banner", "featured"),
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
            modelName: modelBranchName,
            tableName: "branches",
            timestamps: true, 
        }
    );
}
import { DataTypes, Model, Sequelize } from "sequelize";

export class UserPersistence extends Model {
    declare id: string;
    declare name: string;
    declare image?: string | null;
    declare email: string;
    declare username: string;
    declare password: string;
    declare location?: string | null;
    declare bio?: string | null;
    declare status: "active" | "inactive" | "deleted" | "banner" | "featured";
    declare role : "branch"| "user" | "admin";
    declare createdAt: Date;
    declare updatedAt: Date;
}

export const modelUserName = "user";

export function init(sequelize: Sequelize) {
    UserPersistence.init(
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
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            bio: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("active" , "inactive" , "deleted" , "banner" , "featured"),
                allowNull: false,
                defaultValue: "ACTIVE",
            },
            role: {
                type: DataTypes.ENUM("branch" , "admin" , "user" ),
                allowNull: false,
                defaultValue: "ACTIVE",
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
            modelName: modelUserName,
            tableName: "users",
            timestamps: true,
        }
    );
}

import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface RoleAttributes {
  id: number;
  name: string;
  created_at?: Date;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, "id" | "created_at"> {}

export class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public readonly created_at!: Date;
}

export const initRoleModel = (sequelize: Sequelize) => {
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
};

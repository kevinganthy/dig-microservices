import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface MatrixAttributes {
  id: number;
  role_id: number;
  route: string;
  r: string;
  w: string;
  u: string;
  d: string;
  created_at?: Date;
}

interface MatrixCreationAttributes extends Optional<MatrixAttributes, "id" | "created_at"> {}

export class Matrix extends Model<MatrixAttributes, MatrixCreationAttributes> implements MatrixAttributes {
  public id!: number;
  public role_id!: number;
  public route!: string;
  public r!: string;
  public w!: string;
  public u!: string;
  public d!: string;
  public readonly created_at!: Date;
}

export const initMatrixModel = (sequelize: Sequelize) => {
  Matrix.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      route: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      r: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      w: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      u: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      d: {
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
      tableName: "matrix",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
    }
  );
};

import { Sequelize } from "sequelize";
import { CONFIG } from "../config";
import { initUserModel, User } from "./user";
import { initRoleModel, Role } from "./role";
import { initMatrixModel, Matrix } from "./matrix";

export const sequelize = new Sequelize(
  CONFIG.DATABASE.NAME,
  CONFIG.DATABASE.USER,
  CONFIG.DATABASE.PASSWORD,
  {
    host: CONFIG.DATABASE.HOST,
    dialect: "postgres",
  }
);

export const initDatabase = async () => {
    initUserModel(sequelize);
    initRoleModel(sequelize);
    initMatrixModel(sequelize);
    
    User.belongsTo(Role, { foreignKey: "role_id" });
    Role.hasMany(User, { foreignKey: "role_id" });
    Matrix.belongsTo(Role, { foreignKey: "role_id" });
    Role.hasMany(Matrix, { foreignKey: "role_id" });

    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established");
    } catch (error) {
      console.error("❌ Unable to connect to the database:", error);
    }
};

export { User, Role, Matrix };
import { Product, initProductModel } from "./product.js"
import { Sequelize } from "sequelize"
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
      host: "db-product",
      dialect: "postgres",
    }
  );
  
export const initDatabase = async () => {
    
    initProductModel(sequelize)

    try {
      await sequelize.authenticate();
      console.log("✅ Database connection established");
    } catch (error) {
      console.error("❌ Unable to connect to the database:", error);
    }
};

export { Product };
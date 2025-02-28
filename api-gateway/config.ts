import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
  PORT: process.env.PORT || 3000,
  TOKEN_SECRET: process.env.TOKEN_SECRET as string,
  DATABASE: {
    NAME: process.env.POSTGRES_DB || "",
    USER: process.env.POSTGRES_USER || "",
    PASSWORD: process.env.POSTGRES_PASSWORD || "",
    HOST: process.env.HOST_DB || "",
    DIALECT: "postgres",
  },
  REDIS_HOST: process.env.REDIS_HOST || "",
  SERVICES: {
    PRODUCT: process.env.HOST_PRODUCT,
    CART: process.env.HOST_CART,
  },
};

import express from 'express';
import bodyParser from 'body-parser';

import { initDatabase } from "./models";
import { UserPayload } from "./@types/auth";

import authRoutes from "./routes/auth";
import { validateJWT } from './middlewares/jwt';
import { productProxy } from './proxies/product';
import { productMiddleware } from './middlewares/product';
import { cartMiddleware } from './middlewares/cart';
import { cartsProxy } from './proxies/cart';



declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

initDatabase();

const app = express();
app.use(bodyParser.json());

// Public routes
app.use("/auth", authRoutes);

// Private routes
app.use(validateJWT);
app.use('/products', productMiddleware, productProxy);
app.use('/carts', cartMiddleware, cartsProxy);


app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
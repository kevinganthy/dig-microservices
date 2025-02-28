import express from 'express';
import bodyParser from 'body-parser';
import { initDatabase } from "./models";
import authRoutes from "./routes/auth";
import { validateJWT } from './middlewares/auth';
import { productProxy } from './proxies/product';
import { productMiddleware } from './middlewares/product';
import { cartMiddleware } from './middlewares/cart';
import { cartsProxy } from './proxies/cart';

initDatabase();

const app = express();

// Public routes
app.use("/auth", authRoutes);

// Private routes
app.use(validateJWT);
app.use(bodyParser.text({ type: 'text/plain' }));
app.use('/products', productMiddleware, productProxy);
app.use('/carts', cartMiddleware, cartsProxy);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
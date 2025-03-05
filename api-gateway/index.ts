import express from 'express';
import { initDatabase } from "./models";
import authRoutes from "./routes/auth";
import { validateJWT } from './middlewares/auth';
import { rbacMiddleware } from './middlewares/rbac';
import { productProxy } from './proxies/product';
import { cartsProxy } from './proxies/cart';

initDatabase();

const app = express();

// Public routes
app.use("/auth", authRoutes);

// Private routes
app.use(validateJWT, rbacMiddleware);
app.use('/products', productProxy);
app.use('/carts', cartsProxy);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
});
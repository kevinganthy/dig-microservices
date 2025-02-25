import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose, { Document, Schema } from 'mongoose';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://db-cart:27017/cart');

interface IProduct {
  product_id: number;
  quantity: number;
}

interface ICart extends Document {
  client_id: number;
  cart: IProduct[];
}

const cartSchema: Schema = new mongoose.Schema({
  client_id: { type: Number, required: true },
  cart: [
    {
      product_id: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const Cart = mongoose.model<ICart>('Cart', cartSchema);

app.get('/', (_req: Request, res: Response): void => {
  res.send('Hello from Cart Service');
});

app.get('/carts', async (_req: Request, res: Response): Promise<void> => {
  try {
    const carts = await Cart.find();
    res.json(carts);
  } catch (error) {
    res.status(500).send((error as Error)?.message);
  }
});

app.get('/carts/:id', async (req: Request, res: Response): Promise<void> => {
  const cartId = req.params.id;
  try {
    const cart = await Cart.findOne({ _id: cartId });
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send('Cart not found');
    }
  } catch (error) {
    res.status(500).send((error as Error)?.message);
  }
});

app.post('/carts/:id/product/:productId', async (req: Request, res: Response): Promise<void> => {
  const cartId = req.params.id;
  const productId = req.params.productId;
  const { quantity }: { quantity: number } = req.body;
  try {
    let cart = await Cart.findOne({ client_id: Number(cartId) });
    if (!cart) {
      cart = new Cart({ client_id: Number(cartId), cart: [] });
    }
    const productIndex = cart.cart.findIndex((item: IProduct) => item.product_id === Number(productId));
    if (productIndex > -1) {
      cart.cart[productIndex].quantity += quantity;
    } else {
      cart.cart.push({ product_id: Number(productId), quantity });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).send((error as Error)?.message);
  }
});

app.put('/carts/:id/product/:productId', async (req: Request, res: Response): Promise<void> => {
  const cartId = req.params.id;
  const productId = req.params.productId;
  const { quantity }: { quantity: number } = req.body;
  try {
    const cart = await Cart.findOne({ client_id: Number(cartId) });
    if (cart) {
      const productIndex = cart.cart.findIndex((item: IProduct) => item.product_id === Number(productId));
      if (productIndex > -1) {
        cart.cart[productIndex].quantity = quantity;
        await cart.save();
        res.json(cart);
      } else {
        res.status(404).send('Product not found in cart');
      }
    } else {
      res.status(404).send('Cart not found');
    }
  } catch (error) {
    res.status(500).send((error as Error)?.message);
  }
});

app.listen(PORT, (): void => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

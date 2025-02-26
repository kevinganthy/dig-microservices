import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import mongoose, { Document, Schema } from 'mongoose';

const app = express();
const PORT = 3000;
app.use(bodyParser.json());



interface IProduct {
  product_id: Number;
  quantity: number;
}

interface ICart extends Document {
  client_id: number;
  content: IProduct[];
}

const cartSchema: Schema = new mongoose.Schema({
  client_id: { type: Number, required: true },
  content: [
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

app.get('/carts/clients/:id', async (req: Request, res: Response): Promise<void> => {
  const clientId = req.params.id;
  try {
    const cart = await Cart.findOne({ client_id: Number(clientId) });
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send('Cart not found');
    }
  } catch (error) {
    res.status(500).send((error as Error)?.message);
  }
});

app.put('/carts/clients/:id/product', async (req: Request, res: Response): Promise<void> => {
  const clientId = req.params.id;
  const { quantity, product_id }: { quantity: number, product_id: number } = req.body;

  try {
    // Look for a cart with the client_id
    let cart = await Cart.findOne({ client_id: Number(clientId) });

    // Create a new cart if it doesn't exist
    if (!cart) {
      cart = new Cart({ client_id: Number(clientId), content: [] });
    }

    // Check if the product is already in the cart
    const productIndex = cart.content.findIndex((item: IProduct) => item.product_id === Number(product_id));
    
    if (productIndex > -1) {
      // Add the quantity to the existing product
      cart.content[productIndex].quantity += quantity;

      // If quantity is 0, remove the product from the cart
      if (cart.content[productIndex].quantity === 0) {
        cart.content.splice(productIndex, 1);
      }
    } else {
      // Add the product to the cart
      cart.content.push({ product_id, quantity });
    }

    // Save and return the cart
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).send((error as Error)?.message);
  }
});



app.listen(PORT, async (): Promise<void> => {
  try {
    await mongoose.connect('mongodb://db-cart:27017/cart');
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

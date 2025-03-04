import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { validateProductInsertion } from './middlewares/product';
import { Cart, IProduct } from './models/cart';

dotenv.config();

const app = express();
app.use(express.json());



app.get('/clients/:client_id', async (req: Request, res: Response) => {
  const clientId = Number(req.params.client_id);
  
  // Uniquement si le panier appartient à l'utilisateur
  const userId = Number(req.headers["x-user-id"]);
  if ( userId && userId !== clientId ) {
    res.status(403).send('Forbidden');
    return;
  }

  try {
    const cart = await Cart.findOne({ client_id: clientId });
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).send('Cart not found');
    }
  } catch (error) {
    res.status(500).send((error as Error)?.message);
  }
});

app.put('/clients/:client_id/products/:product_id',
  validateProductInsertion,
  async (req: Request, res: Response) => {
    const clientId = Number(req.params.client_id);
    const productId = Number(req.params.product_id);
    const { quantity }: { quantity: number } = req.body;

    // Uniquement si le panier appartient à l'utilisateur (sauf pour admin)
    const userId = Number(req.headers["x-user-id"]);
    if ( userId && userId !== clientId ) {
      res.status(403).send('Forbidden');
      return;
    }

    try {
      // Look for a cart with the client_id
      let cart = await Cart.findOne({ client_id: clientId });

      // Create a new cart if it doesn't exist
      if (!cart) {
        cart = new Cart({ client_id: clientId, content: [] });
      }

      // Check if the product is already in the cart
      const productIndex = cart.content.findIndex((item: IProduct) => item.product_id === productId);
      
      if (productIndex > -1) {
        // Add the quantity to the existing product
        cart.content[productIndex].quantity += Number(quantity);

        // If quantity is 0, remove the product from the cart
        if (cart.content[productIndex].quantity === 0) {
          cart.content.splice(productIndex, 1);
        }
      } else {
        // Add the product to the cart
        cart.content.push({ product_id: productId, quantity });
      }

      // Save and return the cart
      await cart.save();
      res.json(cart);
    } catch (error) {
      res.status(500).send((error as Error)?.message);
    }
  }
);



app.listen(process.env.PORT || 3000, async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING as string);
    console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

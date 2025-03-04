import mongoose, { Document, Schema } from 'mongoose';


export interface IProduct {
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

export const Cart = mongoose.model<ICart>('Cart', cartSchema);
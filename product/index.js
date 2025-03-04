import express from "express";
import { validateProductCreation, validateProductUpdate } from "./models/product.js";
import { Product, initDatabase } from "./models/index.js";
import redisClient from "./redis.js";

initDatabase();

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/", validateProductCreation, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/:id", 
  validateProductUpdate, 
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await Product.update(req.body, { where: { id } });
      const updatedProduct = await Product.findByPk(id);
      
      res.locals.product = updatedProduct;
      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async (_req, res) => {
    await redisClient.publish("product:updated", JSON.stringify(res.locals.product));
    res.json(res.locals.product);
  }
);

app.listen(process.env.PORT || 3000, async () => {
  console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`);
});

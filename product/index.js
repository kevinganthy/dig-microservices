import express from "express";
import { validateProductCreation, validateProductUpdate } from "./models/product.js";
import { Product, initDatabase } from "./models/index.js";

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

app.put("/:id", validateProductUpdate, async (req, res) => {
  try {
    const { id } = req.params;
    await Product.update(req.body, { where: { id } });
    const updatedProduct = await Product.findByPk(id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3000, async () => {
  try {
    // await sequelize.sync();
    console.log(`🚀 Server running at http://localhost:${process.env.PORT || 3000}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: "db-product",
    dialect: "postgres",
  }
);

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    in_stock: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    tableName: "products",
  }
);

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.update(req.body, { where: { id } });
    const updatedProduct = await Product.findByPk(id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, async () => {
  try {
    await sequelize.sync();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

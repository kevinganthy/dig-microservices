import { Model, DataTypes } from "sequelize";
import Joi from "joi";

export class Product extends Model {}

export const initProductModel = (sequelize) => {
    Product.init(
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
            sequelize,
            timestamps: true,
            tableName: "products",
            createdAt: "created_at",
            updatedAt: false,
        }
    )
} 
  
export const validateProductCreation = (req, res, next) => {
  
    const createProductSchema = Joi.object({
      name: Joi.string().required(),
      price: Joi.number().required(),
      description: Joi.string().required(),
      in_stock: Joi.boolean().required()
    });
  
    const validation = createProductSchema.validate(req.body);
  
    if (validation.error) {
      res.status(400).send(validation.error);
      return;
    }
  
    next();
  }
  
export const validateProductUpdate = (req, res, next) => {
  
    const updateProductSchema = Joi.object({
      name: Joi.string(),
      price: Joi.number(),
      description: Joi.string(),
      in_stock: Joi.boolean()
    });
  
    const validation = updateProductSchema.validate(req.body);
  
    if (validation.error) {
      res.status(400).send(validation.error);
      return;
    }
  
    next();
}
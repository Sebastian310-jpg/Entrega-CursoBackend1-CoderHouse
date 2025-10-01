import express from 'express';
import ProductManager from '../manager/productManager.js';

const viewsRouter = express.Router();

const productManager = new ProductManager("./src/data/products.json");

viewsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render("home", { products });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

export default viewsRouter;
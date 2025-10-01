import express from 'express';
import ProductManager from '../manager/productManager.js';

const productsRouter = express.Router();
const productManager = new ProductManager("./src/data/products.json");

// Todos los Productos (JSON)
productsRouter.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.status(200).json({ message: "Lista de Productos:", products });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Un solo producto (JSON)
productsRouter.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const product = await productManager.getProductById(productId);

    res.status(200).json({ message: "Producto:", product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Añadir un producto
productsRouter.post("/s", async (req, res) => {
  try {
    const newProduct = req.body;

    const products = await productManager.addProduct(newProduct);

    res.status(201).json({ message: "Producto añadido. Lista de Productos actualizada:", products });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un producto por su ID
productsRouter.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updates = req.body;

    const products = await productManager.setProductById(productId, updates);

    res.status(200).json({ message: "Producto actualizado. Lista de Productos: ", products });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Borrar un producto por su ID
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const products = await productManager.deleteProductById(productId);

    res.status(200).json({ message: "Producto Eliminado. Lista de Productos: ", products });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default productsRouter;
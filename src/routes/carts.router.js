import express from 'express';
import CartManager from '../manager/cartManager.js';

const cartsRouter = express.Router();
const cartManager = new CartManager("./src/data/carts.json");

// Añadir un carrito
cartsRouter.post("/", async (req, res) => {
  try {
    const carts = await cartManager.addCart();

    res.status(201).json({ message: "Se añadio un nuevo carrito.", carts });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mostrar los productos de un carrito
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const products = await cartManager.getProductsInCart(cartId);

    res.status(200).json({ message: "Productos en el carrito: ", products });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Añadir un producto a un carrito
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartManager.addProductInCart(cartId, productId);

    res.status(201).json({ message: "Producto añadido al carrito", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default cartsRouter;
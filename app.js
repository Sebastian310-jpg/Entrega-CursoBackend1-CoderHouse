import express from 'express';
import ProductManager from './classes/productManager.js';
import CartManager from './classes/cartManager.js';

const app = express();
app.use(express.json());
const productManager = new ProductManager("./data/products.json");
const cartManager = new CartManager("./data/carts.json");

app.get("/", async (req, res) => {
  try {
    res.send("Hola mundo");
  } catch (error) {
    
  }
});


// Mostrar todos los productos
app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.status(200).json({ message: "Lista de Productos:", products });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mostrar un solo producto
app.get("/api/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const product = await productManager.getProductById(productId);

    res.status(200).json({ message: "Producto:", product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Añadir un producto
app.post("/api/products", async (req, res) => {
  try {
    const newProduct = req.body;

    const products = await productManager.addProduct(newProduct);

    res.status(201).json({ message: "Producto añadido. Lista de Productos actualizada:", products });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Actualizar un producto por su ID
app.put("/api/products/:pid", async (req, res) => {
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
app.delete("/api/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const products = await productManager.deleteProductById(productId);

    res.status(200).json({ message: "Producto Eliminado. Lista de Productos: ", products });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Añadir un carrito
app.post("/api/carts", async (req, res) => {
  try {
    const carts = await cartManager.addCart();

    res.status(201).json({ message: "Se añadio un nuevo carrito.", carts });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mostrar los productos de un carrito
app.get("/api/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const products = await cartManager.getProductsInCart(cartId);

    res.status(200).json({ message: "Productos en el carrito: ", products });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Añadir un producto a un carrito
app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartManager.addProductInCart(cartId, productId);

    res.status(201).json({ message: "Producto añadido al carrito", cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const PORT = 8081;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
})
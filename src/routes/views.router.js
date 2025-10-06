import express from 'express';
import ProductManager from '../manager/productManager.js';
import uploader from '../utils/uploader.js';

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

viewsRouter.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render('realTimeProducts', { products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

viewsRouter.post("/realtimeproducts", uploader.single("thumbnail"), async (req, res) => {
  try {
    const { title, description, code, category } = req.body;
    const price = parseInt(req.body.price);
    const stock = parseInt(req.body.stock);
    const thumbnail = `/img/${req.file.filename}`;
    const status = true;

    const newProduct = { title, description, code, price, stock, status, category, thumbnail };
    await productManager.addProduct(newProduct);

    req.app.get("io").emit("productAdded", newProduct);

    res.redirect("/realtimeproducts");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

export default viewsRouter;
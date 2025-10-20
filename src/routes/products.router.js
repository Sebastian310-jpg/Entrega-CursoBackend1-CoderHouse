import express from 'express';
import Product from '../models/products.model.js';

const productsRouter = express.Router();

// Obtener Todos los Productos
productsRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, category, status, sort } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status === "true";

    const sortOptions = {};
    if (sort === "asc") sortOptions.price = 1;
    if (sort === "desc") sortOptions.price = -1;

    const data = await Product.paginate(filter, { limit, page, sort: sortOptions });

    const products = data.docs;
    delete data.docs;

    res.status(200).json({ status: "success", message: "Productos obtenidos correctamente", payload: products, ...data });
    
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los productos: " + error.message });
  }
});

// Obtener un solo Producto
productsRouter.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const product = await Product.findById(productId);
    if(!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado'});

    res.status(200).json({ status: "success", message: "Producto obtenido correctamente", payload: product });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener un producto: " + error.message });
  }
});

// Añadir un producto
productsRouter.post("/", async (req, res) => {
  try {
    const { title, description, thumbnail, code, price, stock, status, category } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
    }

    const product = new Product({ title, description, thumbnail, code, price, stock, status, category });
    await product.save();

    res.status(201).json({ status: "success", message: "Producto agregado correctamente", payload: product });
    
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al agregar un producto: " + error.message });
  }
});

// Actualizar un producto por su ID
productsRouter.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updates = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true, runValidators: true });
    if(!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado'});

    res.status(200).json({ status: "success", message: "Producto actualizado correctamente", payload: updatedProduct });
    
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al actualizar un producto: " + error.message });
  }
});

// Borrar un producto por su ID
productsRouter.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if(!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado'});

    res.status(200).json({ status: "success", message: "Producto eliminado correctamente", payload: deletedProduct });
    
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al eliminar un producto: " + error.message });
  }
});

export default productsRouter;
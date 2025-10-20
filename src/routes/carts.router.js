import express from 'express';
import Cart from '../models/carts.model.js';

const cartsRouter = express.Router();

// Añadir un carrito
cartsRouter.post("/", async (req, res) => {
  try {
    const cart = new Cart();

    await cart.save();

    res.status(201).json({ status: "success", message: "Carrito creado correctamente", payload: cart });
    
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al crear el carrito: " + error.message });
  }
});

// Mostrar los productos de un carrito
cartsRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await Cart.findById(cartId).populate("products.product");

    if(!cart) return res.status(404).json({ status: "error", message: 'Carrito no encontrado'});

    res.status(200).json({ status: "success", message: "Productos del carrito obtenidos correctamente", payload: cart.products });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al obtener los productos del carrito: " + error.message });
  }
});

// Añadir un producto a un carrito
cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid: cartId, pid: productId } = req.params;
    const { quantity = 1 } = req.body || {};

    const updatedCart = await Cart.findById(cartId); 
    if(!updatedCart) return res.status(404).json({ status: "error", message: 'Carrito no encontrado'});  

    const productInCart = updatedCart.products.find(prod => prod.product.toString() === productId);  
    
    if(productInCart){
      productInCart.quantity += quantity; 
    } else {
      updatedCart.products.push({ product: productId, quantity });
    }

    res.status(200).json({ status: "success", message: "Producto agregado al carrito correctamente", payload: updatedCart });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al añadir un producto al carrito: " + error.message });
  }
});

// Eliminar un producto de un carrito
cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid: cartId, pid: productId } = req.params;

    const updatedCart = await Cart.findByIdAndUpdate(cartId, { $pull: { products: { product: productId }} }, { new: true }).populate("products.product");

    if(!updatedCart) return res.status(404).json({ status: "error", message: 'Carrito no encontrado'});

    res.status(200).json({ status: "success", message: "Producto eliminado del carrito correctamente", payload: updatedCart });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al eliminar un producto del carrito: " + error.message });
  }
})

// Eliminar todos los productos de un carrito
cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const updatedCart = await Cart.findByIdAndUpdate(cartId, { $set: { products: [] } }, { new: true });

    if(!updatedCart) return res.status(404).json({ status: "error", message: 'Carrito no encontrado'});

    res.status(200).json({ status: "success", message: "Todos los productos del carrito han sido eliminados correctamente", payload: updatedCart });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al eliminar todos los productos del carrito: " + error.message });
  }
})

// Actualizar la cantidad de un producto del carrito
cartsRouter.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid: cartId, pid: productId } = req.params;
    const { quantity: newQuantity } = req.body || {};

    const cart = await Cart.findById(cartId); 
    if(!cart) return res.status(404).json({ status: "error", message: 'Carrito no encontrado'});
    
    const productInCart = cart.products.find(prod => prod.product.toString() === productId);
    if(!productInCart) return res.status(404).json({ status: "error", message: 'Producto no encontrado en el carrito'});  

    productInCart.quantity = newQuantity;  
    await cart.save();

    const updatedCart = await Cart.findById(cartId).populate("products.product");

    res.status(200).json({ status: "success", message: "Cantidad del producto en el carrito actualizada correctamente", payload: updatedCart });

  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al actualizar el producto del carrito: " + error.message });
  }
})

export default cartsRouter;
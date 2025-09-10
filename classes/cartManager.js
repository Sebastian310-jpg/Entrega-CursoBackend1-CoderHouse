import crypto from 'crypto';
import fs from 'fs/promises';

class CartManager {
  constructor(pathFile){
    this.pathFile = pathFile;
  }

  generateNewId(){
    return crypto.randomUUID();
  }

  async addCart(){
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const newId = this.generateNewId();

      const cart = { id: newId, products: [] };
      carts.push(cart);

      await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");

      return carts;

    } catch (error) {
      throw new Error(`Error al crear el carrito: ${error.message}`);
    }
  }

  async addProductInCart(cartId, productId, quantity = 1){
    try {
      if(quantity <= 0) throw new Error("La cantidad debe ser mayor a 0");

      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const cart = carts.find(c => c.id === cartId);
      if(!cart) throw new Error("Carrito no encontrado");

      const productInCart = cart.products.find(prod => prod.id === productId);

      if(productInCart){
        productInCart.quantity += quantity;

        await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");

        return cart;
      }

      const product = { id: productId, quantity };
      cart.products.push(product);

      await fs.writeFile(this.pathFile, JSON.stringify(carts, null, 2), "utf-8");

      return cart;
    
    } catch (error) {
      throw new Error(`Error al agregar un producto en el carrito: ${error.message}`);
    }
  }

  async getProductsInCart(cartId){
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const carts = JSON.parse(fileData);

      const cart = carts.find(c => c.id === cartId);
      if(!cart) throw new Error("Carrito no encontrado");

      return cart.products;
      
    } catch (error) {
      throw new Error(`Error al obtener los productos del carrito: ${error.message}`);
    }
  }
}

export default CartManager;

// async function main(){
//   try {
//     const cartManager = new CartManager("./data/carts.json");

//     // await cartManager.addCart()
//     // await cartManager.addCart()
//     // await cartManager.addCart()

//     const cart = await cartManager.addProductInCart("157dbf0f-e54f-4dc0-897c-37998fc04e90", "ea24063e-dbf3-4b3c-b18f-e23926855f87", 5);
//     console.log(cart);

//     // const cart = await cartManager.getProductsInCart("157dbf0f-e54f-4dc0-897c-37998fc04e90");
//     // console.log(cart);
    
//   } catch (error) {
//     console.log(error);
//   }
// }

// main();
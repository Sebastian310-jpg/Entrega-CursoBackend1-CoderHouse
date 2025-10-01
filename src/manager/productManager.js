import crypto from "crypto";
import fs from "fs/promises";

class ProductManager {
  constructor(pathFile){
    this.pathFile = pathFile;
  }

  generateNewId(){
    return crypto.randomUUID();
  }

  async addProduct(newProduct){
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const newId = this.generateNewId();

      const product = { id: newId, ...newProduct };
      products.push(product);

      await fs.writeFile(this.pathFile, JSON.stringify(products, null, 2), "utf-8");

      return products;

    } catch (error) {
      throw new Error(`Error al agregar un producto: ${error.message}`);
    }
  }

  async getProducts(){
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      // return { message: "Lista de productos: ", products };
      return products;

    } catch (error) {
      throw new Error(`Error al obtener los productos: ${error.message}`);
    }
  }

  async getProductById(productId){
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const productSearched = products.find(prod => prod.id === productId);

      if(!productSearched) return { message: "El producto no existe." };

      // return { message: "Producto encontrado: ", product: productSearched };
      return productSearched;
      
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${error.message}`);
    }
  }

  async setProductById(productId, updates){
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const indexProduct = products.findIndex(prod => prod.id === productId);
      
      if(indexProduct === -1) return { message: "El producto no existe." };

      products[indexProduct] = { ...products[indexProduct], ...updates };

      // guardar los cambios en el JSON
      await fs.writeFile( this.pathFile, JSON.stringify(products, null, 2), "utf-8" );

      // return { message: "Producto actualizado correctamente", products };
      return products;
      
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async deleteProductById(productId){
    try {
      const fileData = await fs.readFile(this.pathFile, "utf-8");
      const products = JSON.parse(fileData);

      const productsFiltered = products.filter(prod => prod.id !== productId);

      await fs.writeFile(this.pathFile, JSON.stringify(productsFiltered, null, 2), "utf-8" );

      // return { message: "Producto eliminado. Lista de productos actualizada: ", products: productsFiltered };
      return productsFiltered;
      
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }
}

export default ProductManager;

// async function main(){
//   try {
//     const productManager = new ProductManager("./data/products.json");

//     // await productManager.addProduct({ title: "Zapatillas", price: 34, stock: 60 });

//     // const products = await productManager.getProducts();
//     // console.log(products);

//     // const product = await productManager.getProductById("7553b483-f6aa-47a7-bcc1-0917fb5038dd");
//     // console.log(product);

//     // const updates = {
//     //   price: 30,
//     //   stock: 130
//     // }

//     // const product = await productManager.setProductById("7553b483-f6aa-47a7-bcc1-0917fb5038dd", updates);
//     // console.log(product);

//     const products = await productManager.deleteProductById("318e3c45-75d7-483f-8aaf-f65febf318fe");
//     console.log(products);

//   } catch (error) {
//     console.log(error);
//   }
// }

// main();
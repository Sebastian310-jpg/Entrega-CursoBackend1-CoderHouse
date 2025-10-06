import express from 'express';
import http from 'http';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import ProductManager from './manager/productManager.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const productManager = new ProductManager("./src/data/products.json")

app.use(express.json());
app.use(express.static("public"));

// Handlebars config
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Endpoints
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Webstocks
app.set("io", io);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado.');

  socket.on("deleteProduct", async (dataId) => {
    try {
      await productManager.deleteProductById(dataId);

      io.emit("productDeleted", dataId);
    } catch (error) {
      console.log("Error al eliminar el producto: " + error.message); 
    }
  })
});


const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
import express from 'express';
import http from 'http';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();
const server = http.createServer(app);

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
const io = new Server(server);
app.set("io", io);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado.');

  socket.on('new client', (data) => {
    console.log(data.message);
  });
})


const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
})
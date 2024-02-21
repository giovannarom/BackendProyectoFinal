import express from 'express';
import cartsRouter from './routes/cartsRouter.js';
import productsRouter from './routes/productsRouter.js';

const app = express();
const port = 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

// Routes
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

// Escuchando en el puerto
app.listen(port, () => console.log("Server on port: ", port));
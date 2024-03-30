import express from 'express';
import cartsRouter from './routes/cartsRouter.js';
import productsRouter from './routes/productsRouter.js';

//Importaciones PE 2
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));

// Routes
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

//Connecting to MONGO
const connectMongoDB= async()=>{
    const DB_URL='mongodb+srv://grccuenta:ef6zsg6aZ9tvhYsk@ecommerce.xbfxjhb.mongodb.net/'
    try {
        await mongoose.connect(DB_URL)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log('Error while connecting to DB ${error}')
        process.exit()
    }
}
connectMongoDB()

// Configurar el motor de plantillas Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("layouts", "./src/views/layouts/main.handlebars");
app.set("view engine", "handlebars");

// Establecer las rutas de las vistas
app.use('/', viewsRouter)

// Escuchando en el puerto
app.listen(port, () => console.log("Server on port: ", port));
import fs from 'fs';
import path from 'path';
import { Router } from 'express';

const cartsRouter = Router();
const pathCart = path.resolve('data', 'carts.json');

//Functions
// Cart Unique ID
function generateUniqueCartID(cartList) {
    let maxID = 0;
    for (const cart of cartList) {
        if (cart.id > maxID) {
            maxID = cart.id;
        }
    }
    return maxID + 1;
}

//Routes
cartsRouter.post('/', (req, res) => {
    // (POST) Create new cart
    try{
        let carts = fs.readFileSync(pathCart, "utf-8");
        let parsedCart = JSON.parse(carts);
        const newCartID = generateUniqueCartID(parsedCart);
        let newCart = {
            id: newCartID,
            products: []
        };
        parsedCart.push(newCart)
        let data = JSON.stringify(parsedCart)
        fs.writeFileSync(pathCart, data, null)
        res.status(201).json({ id: newCartID, message: "Carrito creado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el carrito" });
    }
});

cartsRouter.get('/:cid', (req, res) => {
    //(GET) List products in the cart
    try {
        //Convert the string to number
        let id = parseInt(req.params.cid);
        let carts = fs.readFileSync(pathCart, "utf-8");
        let parsedCart = JSON.parse(carts);
        //Find the cart that has that ID and send the list of products
        let finalCart = parsedCart.find((cart) => cart.id === id);
        if (finalCart) {
            res.status(200).json(finalCart.products);
            res.status(404).json({ message: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al mostrar carrito" });
    }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    // (POST) Add new product to selected cart
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        let carts = fs.readFileSync(pathCart, "utf-8");
        let parsedCarts = JSON.parse(carts);
        let cartIndex = parsedCarts.findIndex((cart) => cart.id === cartId);

        if (cartIndex === -1) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }

        let productIndex = parsedCarts[cartIndex].products.findIndex((product) => product.id === productId);

        if (productIndex !== -1) {
            // El producto ya existe en el carrito
            parsedCarts[cartIndex].products[productIndex].quantity++;
        } else {
            // El producto no existe en el carrito, agregarlo al arreglo de productos
            parsedCarts[cartIndex].products.push({ id: productId, quantity: 1 });
        }

        fs.writeFileSync(pathCart, JSON.stringify(parsedCarts));

        res.status(201).json({ message: "Producto agregado al carrito correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al agregar el producto al carrito" });
    }
});


export default cartsRouter;

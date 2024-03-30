import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import CartManager from '../src/dao/services/cartManager.js';

const cartsRouter = Router();
const cartManager = new CartManager();
const pathCart = path.resolve('data', 'carts.json');

//Routes

// 1 - (POST) Create new cart
cartsRouter.post('/', async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.addCart();
        res.status(201).json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2 - (GET) List products in the cart
cartsRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const carrito = await cartManager.getCartById(cid);
        res.json(carrito);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3 - (POST) Add new product to selected cart
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const carritoActualizado = await cartManager.addProduct(cid, pid, quantity);
        res.status(200).json({ message: 'Producto agregado al carrito correctamente', carrito: carritoActualizado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4 - (PUT) Update cart with product array
cartsRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    try {
        const carritoActualizado = await cartManager.actualizarCarritoConProductos(cid, products);
        res.status(200).json({ message: 'Carrito actualizado correctamente', carrito: carritoActualizado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5 - (PUT) Update quantity of a product
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const carritoActualizado = await cartManager.actualizarCantidadProducto(cid, pid, quantity);
        res.status(200).json({ message: 'Cantidad del producto actualizada correctamente', carrito: carritoActualizado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 6 - (DELETE) Delete product from cart
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const carritoActualizado = await cartManager.deleteProduct(cid, pid);
        res.status(200).json({ message: 'Producto eliminado del carrito correctamente', carrito: carritoActualizado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default cartsRouter;

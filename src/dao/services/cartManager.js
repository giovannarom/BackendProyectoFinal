import { cartModel } from "../models/carts.js";
import ProductModel from "../models/products.js";
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export default class CartManager {
    
    constructor() {
        console.log("CartManager working");
    }

    // 1 - Get All products
    getAll = async () => {
        try {
            const data = await ProductModel.find();
            return data;
        } catch (err) {
            throw new Error("Error fetching products: " + err.message);
        }
    }
    
    // 2 - Get Cart by ID
    getCartById = async (id) => {
        try {
            const cart = await cartModel.findById(id).populate('products.product');
            if (!cart) throw new Error('El carrito no existe');
            return cart;
        } catch (err) {
            throw new Error("Error fetching cart: " + err.message);
        }
    }
    
    // 3 - Create New Cart
    addCart = async () => {
        try {
            const cart = await cartModel.create({});
            return cart;
        } catch (err) {
            throw new Error("Error creating cart: " + err.message);
        }
    }

    // 4 - Add product to Cart
    addProduct = async (cid, pid, quantity) => {
        try {
            let cart = await cartModel.findById(cid);
            if (!cart) throw new Error('El carrito no existe');
            let productIndex = cart.products.findIndex(product => product.product.toString() === pid);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += parseInt(quantity);
            } else {
                cart.products.push({ product: pid, quantity: parseInt(quantity) });
            }
            return await cart.save();
        } catch (err) {
            throw new Error("Error adding product to cart: " + err.message);
        }
    }

    // 5 - Delete Product by Cart and Product id
    deleteProduct = async (cid, pid) => {
        try {
            let cart = await cartModel.findById(cid);
            if (!cart) throw new Error('El carrito no existe');
            let productIndex = cart.products.findIndex(product => product.product.toString() === pid);
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                return await cart.save();
            } else {
                console.log("El producto no se pudo encontrar");
                return cart; // Si el producto no se encuentra, devolver el carrito sin cambios
            }
        } catch (err) {
            throw new Error("Error deleting product from cart: " + err.message);
        }
    }
    
    // 6 - Actualizar carrito con un arreglo de productos
    actualizarCarritoConProductos = async (cid, nuevosProductos) => {
        try {
            // Obtener el carrito existente por su ID
            const carrito = await cartModel.findById(cid);
            if (!carrito) throw new Error('El carrito no existe');
    
            // Actualizar o agregar los productos en el carrito
            nuevosProductos.forEach(nuevoProducto => {
                const indice = carrito.products.findIndex(producto => producto.product.equals(new ObjectId(nuevoProducto.product)));
                if (indice !== -1) {
                    // Si el producto ya existe en el carrito, actualizar la cantidad
                    carrito.products[indice].quantity = nuevoProducto.quantity;
                } else {
                    // Si el producto no existe en el carrito, agregarlo
                    carrito.products.push(nuevoProducto);
                }
            });
    
            // Eliminar los productos que no están presentes en la lista de nuevos productos
            carrito.products = carrito.products.filter(producto => {
                return nuevosProductos.some(nuevoProducto => new ObjectId(nuevoProducto.product).equals(producto.product));
            });

            // Guardar y devolver el carrito actualizado
            await carrito.save();
            return carrito;
        } catch (err) {
        throw new Error("Error al actualizar el carrito con productos: " + err.message);}
    }


    // 7 - Actualizar cantidad de ejemplares del producto en el carrito
    actualizarCantidadProducto = async (cid, pid, cantidad) => {
        try {
            const carrito = await cartModel.findById(cid);
            if (!carrito) throw new Error('El carrito no existe');
            const indiceProducto = carrito.products.findIndex(producto => producto.product.toString() === pid);
            if (indiceProducto === -1) throw new Error('El producto no se pudo encontrar en el carrito');
            carrito.products[indiceProducto].quantity = cantidad;
            // Guardar el carrito actualizado
            const carritoActualizado = await carrito.save();
            // Verificar si la actualización fue exitosa
            if (carritoActualizado) console.log('La cantidad del producto se actualizó correctamente');
            return carritoActualizado;
        } catch (err) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito: " + err.message);
        }
    }

    //8 - Borrar todos los productos del carrito
    borrarTodosLosProductos = async (cid) => {
        try {
            // Obtener el carrito por su ID
            const carrito = await cartModel.findById(cid);
            if (!carrito) {
                throw new Error('El carrito no existe');
            }
            // Borrar todos los productos del carrito
            carrito.products = [];
            await carrito.save();
            // Devolver el carrito actualizado
            return carrito;
        } catch (err) {
            throw new Error('Error al borrar todos los productos del carrito: ' + err.message);
        }
    }

}


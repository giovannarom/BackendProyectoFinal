import fs from 'fs';
import path from 'path';
import { Router } from 'express';
import ProductManager from '../src/dao/services/productManager.js';

const productManager = new ProductManager();
const productsRouter = Router();
const pathProducts = path.resolve('data', 'products.json');

//Routes

// 1 - (POST) Create new product
productsRouter.post('/', async(req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        // Crear el nuevo producto utilizando el ProductManager
        const newProduct = await productManager.addProduct({
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails: thumbnails || []
        });

        // Devolver el nuevo producto creado como respuesta
        res.status(201).json({ id: newProduct._id, message: "Producto creado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el producto" });
    }
});

// 2 - (GET) Get product by id
productsRouter.get('/:pid/', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getById(productId);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al mostrar producto" });
    }
});

// 3 - (GET) Show all products
productsRouter.get('/', async (req, res) => {
    try {
        const { page, limit, sort, category, available } = req.query;

        // Obtener los resultados paginados utilizando el ProductManager
        const result = await productManager.getAll({
            page: page || 1,
            limit: limit || 10,
            sort,
            category,
            available
        });

        // Formatear la respuesta según el formato requerido
        const formattedResponse = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage || null,
            nextPage: result.nextPage || null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.prevPage ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${result.prevPage}&limit=${limit || 10}` : null,
            nextLink: result.nextPage ? `${req.protocol}://${req.get('host')}${req.baseUrl}?page=${result.nextPage}&limit=${limit || 10}` : null
        };

        res.json(formattedResponse);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 4 - (PUT) Edit product by id
productsRouter.put('/:pid/', async(req, res) => {
    try {
        const productId = req.params.pid;
        const productData = req.body;

        // Actualizar el producto utilizando el ProductManager
        const result = await productManager.updateProduct(productId, productData);
        
        // Si no se encontró el producto para actualizar
        if (!result) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Si el producto fue actualizado exitosamente
        res.status(200).json({ message: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el producto" });
    }
});

// 5 - (DELETE) Delete product by id
productsRouter.delete('/:pid/', async (req, res) => {
    try {
        const productId = req.params.pid;

        // Eliminar el producto utilizando el ProductManager
        const result = await productManager.deleteProduct(productId);
        
        // Si no se encontró el producto para eliminar
        if (!result) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Si el producto fue eliminado exitosamente
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
});

export default productsRouter; 
import fs from 'fs';
import path from 'path';
import { Router } from 'express';

const productsRouter = Router();
const pathProducts = path.resolve('data', 'products.json');

// Cart Unique ID
function generateUniqueProductID(productList) {
    let maxID = 0;
    for (const cart of productList) {
        if (cart.id > maxID) {
            maxID = cart.id;
        }
    }
    return maxID + 1;
}

//Routes
productsRouter.post('/', (req, res) => {
    // (POST) Create new product
    try{
        let products = fs.readFileSync(pathProducts, "utf-8");
        let parsedProducts = JSON.parse(products);
        const newProductID = generateUniqueProductID(parsedProducts);
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }
        console.log(title)
        let newProduct = {
            id: newProductID,
            title,
            description,
            code,
            price,
            status: true, // El status es true por defecto
            stock,
            category,
            thumbnails: thumbnails || []
        };
        parsedProducts.push(newProduct)
        let data = JSON.stringify(parsedProducts)
        fs.writeFileSync(pathProducts, data, null)
        res.status(201).json({ id: newProductID, message: "Producto creado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el producto" });
    }
});


productsRouter.get('/:pid/', (req, res) => {
    //(GET) Show product by id
    try {
        //Convertir el string a número
        let productId = parseInt(req.params.pid);
        let products = fs.readFileSync(pathProducts, "utf-8");
        let parsedProducts = JSON.parse(products);
        //Encontrar el producto que tiene ese ID
        let finalProduct = parsedProducts.find((product) => product.id === productId);
        if (finalProduct) {
            res.status(200).json(finalProduct);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al mostrar producto" });
    }
});

productsRouter.get('/', (req, res) => {
    //(GET) Show all products
    try {
        let products = fs.readFileSync(pathProducts, "utf-8");
        let parsedProducts = JSON.parse(products);

        // Verificar 'limit'
        const limit = parseInt(req.query.limit);
        if (isNaN(limit)) {
            // Devolver todos los productos
            res.status(200).json(parsedProducts);
        } else {
            // Devolver los primeros 'limit' productos
            const limitedProducts = parsedProducts.slice(0, limit);
            res.status(200).json(limitedProducts);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al mostrar productos" });
    }
});

productsRouter.put('/:pid/', (req, res) => {
    //(PUT) Edit product by id
    try {
        // Convertir el string a número
        let productId = parseInt(req.params.pid);
        let products = fs.readFileSync(pathProducts, "utf-8");
        let parsedProducts = JSON.parse(products);
        // Encontrar el producto que tiene ese ID
        let finalProductIndex = parsedProducts.findIndex((product) => product.id === productId);
        if (finalProductIndex !== -1) {
            let finalProduct = parsedProducts[finalProductIndex];
            // Actualizar los campos del producto
            Object.assign(finalProduct, req.body);
            parsedProducts[finalProductIndex] = finalProduct;
            fs.writeFileSync(pathProducts, JSON.stringify(parsedProducts));
            res.status(200).json({ message: "Producto modificado correctamente", updatedProduct: finalProduct });
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al modificar el producto" });
    }
});

productsRouter.delete('/:pid/', (req, res) => {
    //(DELETE) Delete product by id
    try {
        // Convertir el string a número
        let productId = parseInt(req.params.pid);
        let products = fs.readFileSync(pathProducts, "utf-8");
        let parsedProducts = JSON.parse(products);
        // Encontrar el índice del producto que tiene ese ID
        let finalProductIndex = parsedProducts.findIndex((product) => product.id === productId);
        if (finalProductIndex !== -1) {
            // Eliminar el producto del arreglo de productos
            parsedProducts.splice(finalProductIndex, 1);
            // Escribir los productos actualizados de vuelta al archivo JSON
            fs.writeFileSync(pathProducts, JSON.stringify(parsedProducts));
            res.status(200).json({ message: "Producto eliminado correctamente" });
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar el producto" });
    }
});

export default  productsRouter; 
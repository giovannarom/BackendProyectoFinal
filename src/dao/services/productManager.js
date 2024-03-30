import ProductModel from "../models/products.js";

export default class ProductManager {
    
    constructor() {
        console.log("ProductManager working");
    }
    
    // 1 - Get All products
    async getAll({ page = 1, limit = 10, sort, category, available }) {
        try {
            const query = {};

            if (category) {
                query.category = category;
            }

            if (available !== undefined) {
                query.status = available === 'true';
            }

            const options = {
                page: parseInt(page),
                limit: parseInt(limit)
            };

            if (sort) {
                options.sort = { price: sort === 'desc' ? -1 : 1 };
            }

            const result = await ProductModel.paginate(query, options);
            return result;
        } catch (error) {
            throw new Error("Error fetching products: " + error.message);
        }
    }
    
    // 2 - Get Product by ID
    getById = async (id) => {
        try {
            const product = await ProductModel.findById(id);
            if (!product) throw new Error('El producto no existe');
            return product;
        } catch (err) {
            throw new Error("Error fetching product: " + err.message);
        }
    }
    
    // 3 - Create New Product
    addProduct = async (newProduct) => {
        try {
            const product = await ProductModel.create(newProduct);
            return product;
        } catch (err) {
            throw new Error("Error adding product: " + err.message);
        }
    }

    // 4 - Update/Edit product by ID
    updateProduct = async (id, productData) => {
        try {
            const result = await ProductModel.updateOne({ _id: id }, { $set: productData });
            if (result.n === 0) throw new Error('No se encontró el producto para actualizar.');
            return 'Se han actualizado los datos del producto ';
        } catch (err) {
            throw new Error("Error updating product: ", err.message);
        }
    }

    // 5 - Delete Product by id
    deleteProduct = async (id) => {
        try {
            const result = await ProductModel.deleteOne({ _id: id });
            return result;
        } catch (err) {
            throw new Error("Error deleting product: " + err.message);
        }
    }
}



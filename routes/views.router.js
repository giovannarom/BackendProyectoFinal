import { Router } from "express";
import ProductModel from '../src/dao/models/products.js';
import CartManager from '../src/dao/services/cartManager.js';
import ProductManager from '../src/dao/services/productManager.js';

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

//Renderizar la pagina inicial (Index)
router.get("/", (req, res) => {
  res.render("index", { title: "Listado de productos" });
});

//Renderizar lista de productos (Products Handlebars)
router.get("/products", async (req, res) => {
  let page = parseInt(req.query.page);
  if (!page) page = 1;
  const result = await ProductModel.paginate(
    {},
    { page, limit: 6, lean: true }
  );

  result.isValid = page >= 1 && page <= result.totalPages; //variable booleana
  result.nextLink = result.hasNextPage
    ? `http://localhost:8080/products?page=${result.nextPage}`
    : "";
  result.prevLink = result.hasPrevPage
    ? `http://localhost:8080/products?page=${result.prevPage}`
    : "";

  res.render("products", result);
});

//Renderizar vista de un producto (Product Details Handlebars)
router.get("/products/:pid/", async (req, res) => {
  try {
    const productId = req.params.pid;
    // Buscar el producto por su ID en la base de datos
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    // Renderizar la vista de detalles del producto y pasar los datos del producto como contexto
    res.render("productdetails", { title: product.title, price:product.price, code:product.code, status: product.status, stock: product.stock, thumbnails: product.thumbnails, description:product.description, category:product.category});
  } catch (error) {
    console.error('Error al obtener detalles del producto:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//Renderizar vista de un carrito (Product Details Handlebars)
router.get("/carts/:cid", async(req, res) => {
  const { cid } = req.params;
  
  try {
    // Obtiene el carrito por su ID
    const cart = await cartManager.getCartById(cid);

    // Verifica si el carrito existe
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }
    // Recupera los detalles de cada producto en el carrito
    const productsDetails = await Promise.all(cart.products.map(async item => {
      const product = await productManager.getById(item.product);
      return {
        title: product.title, // Accede al título del producto
        quantity: item.quantity
      };
    }));

    // Renderiza la vista con los datos del carrito y los productos convertidos
    res.render("cart", { title: "Listado de productos en carrito", products: productsDetails }); 
  
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Error al obtener el carrito');
  }
});

export default router;
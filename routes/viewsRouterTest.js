import { Router } from "express";
import ProductModel from '../src/dao/models/products.js';
import CartManager from '../src/dao/services/cartManager.js';
import ProductManager from '../src/dao/services/productManager.js';

const router = Router();
const cartManager = new CartManager();

router.get("/", (req, res) => {
  res.render("index", { title: "Listado de productos" });
});
router.get("/products", async (req, res) => {
  let page = parseInt(req.query.page);
  if (!page) page = 1;
  const result = await ProductModel.paginate(
    {},
    { page, limit: 6, lean: true }
  );
  console.log(result);

  result.isValid = page >= 1 && page <= result.totalPages; //variable booleana
  result.nextLink = result.hasNextPage
    ? `http://localhost:5000/products?page=${result.nextPage}`
    : "";
  result.prevLink = result.hasPrevPage
    ? `http://localhost:5000/products?page=${result.prevPage}`
    : "";

  res.render("products", result);
});

export default router;
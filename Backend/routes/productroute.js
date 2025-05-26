import express from "express";
import {
  createProduct,
  getProductsByCompany,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts, 
  getProductsByCategory,
  addreview
} from "../Controller/productcontroller.js";
import { singleProductImageUpload } from "../middleware/mutler.js";

const router = express.Router();

// for company
router.post("/", singleProductImageUpload, createProduct);
router.get("/company/:companyId", getProductsByCompany);
router.put("/:id",singleProductImageUpload, updateProduct);
router.delete("/:id", deleteProduct);
router.get("/single/:id", getProductById);

// for user
router.get("/product", getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/review/:id", addreview);

export default router;

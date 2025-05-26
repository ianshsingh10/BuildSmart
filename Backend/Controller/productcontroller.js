import Company from "../models/company.js";
import Product from "../models/products.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Create product with image upload
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, offprice,category, companyId, stock } = req.body;

    if (!req.file) return res.status(400).json({ error: "Product image is required." });
    if (!name || !description || !price || !companyId || !stock)
      return res.status(400).json({ error: "All fields are required." });

    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ error: "Company not found." });

    let productImage = "";

    if (req.file) { // Access the file uploaded with 'productImage'
      const fileUri = getDataUri(req.file); // Convert to data URI
      const cloud = await cloudinary.uploader.upload(fileUri.content); // Upload to Cloudinary
      productImage = cloud.secure_url;
    }

    const newProduct = new Product({
      name,
      description,
      price,
      offprice: offprice || price,
      productImage,
      stock,
      category,
      company: company.name
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);
    if (!company) return res.status(404).json({ error: "Company not found." });

    const products = await Product.find({ company: company.name });
    res.status(200).json({ products });
  } catch (err) {
    console.error("Error getting products:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, offprice,category,stock, photo } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found." });

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (offprice) product.offprice = offprice;
    if (photo) product.photo = photo;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found." });

    await product.deleteOne();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found." });
    res.status(200).json({ product });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.status(200).json({ products });
  } catch (err) {
    console.error("Error fetching category products:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const addreview = async (req, res) => {
  const { userId, review, reviewer, rating } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });

  product.reviews.push({ user: userId, comment: review,reviewer, rating }); // <-- Fix here
  const ratings = product.reviews.map(r => r.rating);
  product.rating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

  await product.save();
  res.json({ message: "Review added", product });
};

import multer from "multer";

// Configure memory storage for file uploads
const storage = multer.memoryStorage();

// Single upload middleware for logo
export const singleUpload = multer({ storage }).single("logo");

// Single upload middleware for product image
export const singleProductImageUpload = multer({ storage }).single("productImage");

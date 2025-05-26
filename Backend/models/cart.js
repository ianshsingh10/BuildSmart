// models/cart.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true, // One cart per user
    required: true,
  },
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;

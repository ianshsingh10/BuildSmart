// models/cart.js
import mongoose from "mongoose";

const wishlistitems = new mongoose.Schema({
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

const wishlistschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    unique: true, // One cart per user
    required: true,
  },
  items: [wishlistitems],
});

const Wishlist = mongoose.model("Whishlist", wishlistschema);
export default Wishlist;

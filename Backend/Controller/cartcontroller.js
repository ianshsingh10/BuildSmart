import mongoose from "mongoose";
import Cart from "../models/cart.js";
import Wishlist from "../models/whislist.js";

export const add = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Missing userId or productId" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ product: productId, quantity }],
      });
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingItemIndex !== -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new product
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.error("Cart update error:", error);
    res.status(500).json({ message: "Server error while updating cart" });
  }
};

// Controller: cartitems function
export const cartitems = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.product');

    if (!cart) {
      return res.status(200).json({ items: [] }); // Return empty array if no cart found
    }

    res.status(200).json({ items: cart.items });
  } catch (error) {
    console.error('Failed to get cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

export const updatequantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    // Correctly create ObjectId
    const objectId = new mongoose.Types.ObjectId(itemId);

    const updatedCart = await Cart.findOneAndUpdate(
      { "items._id": objectId },
      {
        $set: {
          "items.$.quantity": quantity,
        },
      },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(updatedCart);
  } catch (err) {
    console.error("Error updating quantity:", err);
    res.status(500).json({ message: "Failed to update quantity", error: err.message });
  }
};

export const removeItem = async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const cart = await Cart.findOne({ "items._id": itemId });

    if (!cart) return res.status(404).json({ message: "Cart item not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.params.userId;

    const cart = await Cart.findOne({ userId });
    let wishlist = await Wishlist.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const itemInCart = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!itemInCart) {
      return res.status(404).json({ message: "Product not found in cart." });
    }

    const quantity = itemInCart.quantity || 1;

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    const alreadyInWishlist = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    if (!alreadyInWishlist) {
      wishlist.items.push({ product: productId, quantity });
      await wishlist.save();
      return res.status(200).json({ message: "Product added to wishlist." });
    }

    return res.status(200).json({ message: "Product already in wishlist." });
  } catch (error) {
    console.error("Error moving item to wishlist:", error);
    return res.status(500).json({ message: "Server error." });
  }
};

export const wishlistItems = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId }).populate('items.product');

    if (!wishlist) {
      return res.status(200).json({ items: [] }); // Return empty array if no cart found
    }

    res.status(200).json({ items: wishlist.items });
  } catch (error) {
    console.error('Failed to get cart items:', error);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

export const updatewishlistquantity = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const objectId = new mongoose.Types.ObjectId(itemId);

    const updatedCart = await Wishlist.findOneAndUpdate(
      { "items._id": objectId },
      {
        $set: {
          "items.$.quantity": quantity,
        },
      },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(updatedCart);
  } catch (err) {
    console.error("Error updating quantity:", err);
    res.status(500).json({ message: "Failed to update quantity", error: err.message });
  }
};

export const removewishlistItem = async (req, res) => {
  const itemId = req.params.itemId;

  try {
    const cart = await Wishlist.findOne({ "items._id": itemId });

    if (!cart) return res.status(404).json({ message: "Cart item not found" });

    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    await cart.save();

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const WishlistToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.params.userId;

    const wishlist = await Wishlist.findOne({ userId });
    let cart = await Cart.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Cart not found." });
    }

    const itemInWishlist = wishlist.items.find(
      (item) => item.product.toString() === productId
    );

    if (!itemInWishlist) {
      return res.status(404).json({ message: "Product not found in Wishlist." });
    }

    const quantity = itemInWishlist.quantity || 1;

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const alreadyInCart = cart.items.some(
      (item) => item.product.toString() === productId
    );

    if (!alreadyInCart) {
      cart.items.push({ product: productId, quantity });
      await cart.save();
      return res.status(200).json({ message: "Product added to cart." });
    }

    return res.status(200).json({ message: "Product already in cart." });
  } catch (error) {
    console.error("Error moving item to cart:", error);
    return res.status(500).json({ message: "Server error." });
  }
};
import express from "express";
import { add, cartitems, updatequantity, removeItem, addToWishlist, wishlistItems ,updatewishlistquantity, removewishlistItem, WishlistToCart} from "../Controller/cartcontroller.js";

const router = express.Router();

router.post("/add", add);
router.get('/user/:userId',cartitems);
router.put('/update/:itemId',updatequantity);
router.delete("/remove/:itemId",removeItem);

router.post("/wishlist/:userId", addToWishlist);
router.get('/user/wishlist/:userId',wishlistItems);
router.put('/wishlist/update/:itemId',updatewishlistquantity);
router.delete("/wishlist/remove/:itemId",removewishlistItem);

router.post("/wishlist/move-to-cart/:userId", WishlistToCart);

export default router;
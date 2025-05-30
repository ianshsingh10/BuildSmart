import React, { useEffect, useState } from "react";
import axios from "axios";
import { Cart } from "../utils/constant";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setwishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedQuantities, setEditedQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAndCart();
  }, []);

  const fetchUserAndCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        navigate("/login");
        return;
      }

      const { data: cartData } = await axios.get(`${Cart}/user/${userId}`);
      const { data: wishListData } = await axios.get(
        `${Cart}/user/wishlist/${userId}`
      );

      setCartItems(cartData.items || []);
      setwishlistItems(wishListData.items || []);

      // After fetching both cart and wishlist
      const initialQuantities = {};
      cartData.items?.forEach((item) => {
        initialQuantities[item._id] = item.quantity;
      });
      wishListData.items?.forEach((item) => {
        initialQuantities[item._id] = item.quantity;
      });
      setEditedQuantities(initialQuantities);
    } catch (err) {
      console.error("Error loading cart:", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (sum, item) => sum + item.product.offprice * editedQuantities[item._id],
      0
    );

  const handleCheckout = () => {
    const itemsToCheckout = cartItems.map((item) => ({
      product: item.product,
      quantity: editedQuantities[item._id] || item.quantity,
    }));
    navigate("/checkout", { state: { items: itemsToCheckout } });
  };

  const handleQuantityInput = (itemId, newQuantity) => {
    setEditedQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  };

  const handleQuantityUpdate = async (itemId) => {
    const newQuantity = editedQuantities[itemId];
    if (newQuantity < 1) return;

    try {
      await axios.put(`${Cart}/update/${itemId}`, { quantity: newQuantity });

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      alert("Quantity updated to: " + newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
      alert("Error updating quantity.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(`${Cart}/remove/${itemId}`); // Your backend should support this route
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
      alert("Item removed from cart.");
    } catch (error) {
      console.error("Failed to delete item:", error);
      alert("Error removing item from cart.");
    }
  };

  const handleMoveToWishlist = async (itemId, productId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in to move items to wishlist.");
        return;
      }

      const wishlistResponse = await axios.post(`${Cart}/wishlist/${userId}`, {
        productId,
      });

      if (wishlistResponse.status !== 200 && wishlistResponse.status !== 201) {
        throw new Error("Failed to add item to wishlist");
      }

      await axios.delete(`${Cart}/remove/${itemId}`);

      setCartItems((prevItems) => prevItems.filter((i) => i._id !== itemId));

      alert("Item successfully moved to wishlist.");
    } catch (error) {
      console.error(
        "Failed to move to wishlist:",
        error?.response?.data || error
      );
      alert("Error occurred while moving item to wishlist.");
    }
    fetchUserAndCart();
  };

  const handleDeleteWishlistItem = async (itemId) => {
    try {
      await axios.delete(`${Cart}/wishlist/remove/${itemId}`);
      setwishlistItems((prev) => prev.filter((item) => item._id !== itemId));
      alert("Item removed from wishlist.");
    } catch (error) {
      console.error("Failed to delete wishlist item:", error);
      alert("Error deleting wishlist item.");
    }
  };

  const handleWishlistQuantityUpdate = async (itemId) => {
    const newQuantity = editedQuantities[itemId];
    if (newQuantity < 1) return;

    try {
      await axios.put(`${Cart}/wishlist/update/${itemId}`, {
        quantity: newQuantity,
      });
      setwishlistItems((prevItems) =>
        prevItems.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      alert("Wishlist quantity updated.");
    } catch (error) {
      console.error("Failed to update wishlist quantity:", error);
      alert("Error updating wishlist quantity.");
    }
  };

  const handleMoveToCart = async (productId, itemId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Please log in.");
        return;
      }

      const response = await axios.post(
        `${Cart}/wishlist/move-to-cart/${userId}`,
        {
          productId,
        }
      );

      if (response.status === 200) {
        await axios.delete(`${Cart}/wishlist/remove/${itemId}`);
        setwishlistItems((prev) => prev.filter((item) => item._id !== itemId));
        alert("Item moved to cart.");
      } else {
        throw new Error("Move to cart failed.");
      }
    } catch (error) {
      console.error("Failed to move to cart:", error);
      alert("Error moving item to cart.");
    }
    fetchUserAndCart();
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 font-medium mb-4 inline-flex items-center hover:underline"
      >
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Your cart is empty.
        </div>
      ) : (
        cartItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between mb-4 border-b pb-4"
          >
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => navigate(`/product-detail/${item.product._id}`)}
            >
              <img
                src={item.product.productImage}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-sm text-gray-600">
                  Price: ₹{item.product.offprice}
                </p>
                <p className="text-sm font-semibold">
                  Subtotal: ₹
                  {item.product.offprice * editedQuantities[item._id]}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mt-2">
              <div>
                <label className="text-sm block text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={editedQuantities[item._id]}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleQuantityInput(item._id, parseInt(e.target.value, 10))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                />
              </div>

              <button
                onClick={() => handleQuantityUpdate(item._id)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Update
              </button>

              <button
                onClick={() => handleDeleteItem(item._id)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>

              <button
                onClick={() => handleMoveToWishlist(item._id, item.product._id)}
                className="text-sm bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
              >
                Move to Wishlist
              </button>
            </div>
          </div>
        ))
      )}

      <div className="text-right mt-6">
        <h2 className="text-xl font-bold mb-2">Total: ₹{calculateTotal()}</h2>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Proceed to Checkout
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-6">WishList</h1>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Your wishlist is empty.
        </div>
      ) : (
        wishlistItems.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between mb-4 border-b pb-4"
          >
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => navigate(`/product-detail/${item.product._id}`)}
            >
              <img
                src={item.product.productImage}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-sm text-gray-600">
                  Price: ₹{item.product.offprice}
                </p>
                <p className="text-sm font-semibold">
                  Subtotal: ₹
                  {item.product.offprice * editedQuantities[item._id]}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4 mt-2">
              <div>
                <label className="text-sm block text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={editedQuantities[item._id]}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleQuantityInput(item._id, parseInt(e.target.value, 10))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded"
                />
              </div>

              <button
                onClick={() => handleWishlistQuantityUpdate(item._id)}
                className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Update
              </button>

              <button
                onClick={() => handleDeleteWishlistItem(item._id)}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>

              <button
                onClick={() => handleMoveToCart(item.product._id, item._id)}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Move to Cart
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

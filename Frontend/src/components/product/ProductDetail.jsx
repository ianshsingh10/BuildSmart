import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Star } from "lucide-react";
import { User, Product, Cart } from "../../utils/constant";

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const navigate = useNavigate();

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${Product}/single/${productId}`);
        setProduct(res.data.product);
        setReviews(res.data.product.reviews || []);
      } catch (err) {
        setError("Failed to load product.");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axios.get(`${User}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        console.error("Fetch user error:", err);
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
    };
    fetchUser();
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!user?._id) return alert("You must be logged in to add to cart.");
    if (quantity < 1) return alert("Quantity must be at least 1.");

    try {
      await axios.post(`${Cart}/add`, {
        userId: user._id,
        productId: product._id,
        quantity: quantity,
      });
      alert("Product added to cart!");
      setQuantity(1); // reset quantity
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add product to cart.");
    }
  };

  const handleBuyNow = () => {
  if (!user?._id) {
    alert("You must be logged in to proceed with purchase.");
    navigate("/login");
    return;
  }

  if (quantity < 1) {
    alert("Quantity must be at least 1.");
    return;
  }

  const itemToBuy = {
    product: product,
    quantity: quantity,
  };

  navigate("/checkout", { state: { items: [itemToBuy] } });
};



  const handleAddReview = async () => {
    if (!user._id) return alert("You must be logged in to add a review.");

    if (review && rating > 0) {
      try {
        const res = await axios.post(`${Product}/review/${productId}`, {
          review,
          rating,
          userId: user._id,
          reviewer: user.name, // ⬅️ include the name here
        });

        setReviews([...reviews, res.data.newReview || res.data]);
        setReview("");
        setRating(0);
      } catch (error) {
        console.error("Failed to add review:", error);
        alert("Review submission failed.");
      }
    } else {
      alert("Please provide both a review and a rating.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600 py-10">{error}</div>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 font-medium mb-4 inline-flex items-center hover:underline"
      >
        ← Back
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src={product.productImage}
            alt={product.name}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.description}</p>
          <div className="text-xl font-bold text-blue-600 mb-4">
            ₹{product.offprice}{" "}
            <span className="text-sm line-through text-gray-400 ml-2">
              ₹{product.price}
            </span>
          </div>
          <div className="text-sm text-yellow-500 mb-4">
            ⭐ {product.rating}/5
          </div>
          <div className="mt-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-24 p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAddToCart}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500">
            No reviews yet. Be the first to leave one!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div
                key={review._id || index}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {/* Render filled stars */}
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < review.rating ? "#facc15" : "none"} // yellow-400
                          stroke={i < review.rating ? "#facc15" : "#d1d5db"} // gray-300
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {review.comment} -
                    </span>
                    <span className="text-sm text-gray-600">
                      {review.reviewer}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.review}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Review */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
        <div className="bg-gray-50 border rounded-lg p-6 shadow-sm">
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none"
          />
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-700">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  fill={star <= (hoverRating || rating) ? "#facc15" : "none"} // Tailwind yellow-400
                  stroke={
                    star <= (hoverRating || rating) ? "#facc15" : "#d1d5db"
                  } // gray-300
                />
              </button>
            ))}
          </div>

          <button
            onClick={handleAddReview}
            disabled={!review || rating === 0}
            className={`${
              !review || rating === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2 rounded-md transition`}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Product } from "../utils/constant";
import Footer from "./Footer";

export default function LandingPage() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${Product}/product`);
        setProducts(res.data.products);
        setFiltered(res.data.products); // Initially show all
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = () => {
    const result = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(result);
    setActiveCategory("search");
  };

  const handleCategory = (category) => {
    setActiveCategory(category);
    if (category === "all") {
      setFiltered(products);
    } else {
      const result = products.filter((p) => p.category === category);
      setFiltered(result);
    }
    setSearchTerm("");
  };

  const renderProductGrid = (title, items) => (
    <div className="max-w-7xl mx-auto mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">{title}</h2>
      {items.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg shadow-sm p-4 hover:shadow-md transition duration-200"
            >
              <Link to={`/product-detail/${product._id}`} className="block">
                <div className="relative w-full h-48 mb-4">
                  <img
                    src={product.productImage}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {product.description.slice(0, 60)}...
                </p>
                <div className="text-base font-bold text-blue-600">
                  ₹{product.offprice}{" "}
                  <span className="text-sm line-through text-gray-400 ml-2">
                    ₹{product.price}
                  </span>
                </div>
                <div className="text-sm text-yellow-500 mt-1">
                  ⭐ {product.rating}/5
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );

  return (
    <>
    <div className="px-6 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">BuildSmart</h1>
        <p className="text-lg text-gray-600 mt-2">
          Your one-stop shop for all building materials
        </p>
      </div>

      <div className="max-w-5xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* 🚀 Quick Category Buttons */}
          <div className="flex flex-wrap gap-3">
            {["all", "cement", "tiles", "other"].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* 🔍 Search Bar */}
          <div className="flex w-full md:w-auto">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow md:w-72 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-all duration-200"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {activeCategory === "all" && (
        <>
          {renderProductGrid(
            "Featured Products",
            products.filter((p) => p.featured)
          )}
          {renderProductGrid(
            "Cement",
            products.filter((p) => p.category === "cement")
          )}
          {renderProductGrid(
            "Tiles",
            products.filter((p) => p.category === "tiles")
          )}
          {renderProductGrid(
            "Other Products",
            products.filter((p) => p.category === "other")
          )}
        </>
      )}

      {activeCategory !== "all" &&
        renderProductGrid(
          activeCategory === "search"
            ? `Search Results`
            : `${
                activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)
              } Products`,
          filtered
        )}
    </div>
    <Footer/>
    </>
  );
}

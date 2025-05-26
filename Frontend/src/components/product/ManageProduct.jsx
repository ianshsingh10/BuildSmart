import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Company, Product } from "../../utils/constant";

function ManageProducts() {
  const { companyId } = useParams();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();

  const fetchCompanyDetails = async () => {
    try {
      const res = await axios.get(`${Company}/${companyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCompanyName(res.data.company.name);
    } catch (err) {
      console.error("Failed to fetch company details:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${Product}/company/${companyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${Product}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleAddProduct = () => {
    navigate(`/addproduct/${companyId}`);
  };

  const handleUpdate = (productId) => {
    navigate(`/updateproduct/${companyId}/${productId}`);
  };

  const handleBackClick = () => {
    navigate("/companydashboard");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchCompanyDetails();
    fetchProducts();
  }, [companyId]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="text-indigo-600 font-semibold mb-4 inline-flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5 mr-2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Products for {companyName}</h1>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border border-gray-300 p-2 w-full mb-6 rounded"
      />

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredProducts.map((product) => {
          const discount =
            product.price && product.offprice
              ? Math.round(((product.price - product.offprice) / product.price) * 100)
              : 0;

          return (
            <div
              key={product._id}
              className=" border rounded-lg shadow hover:shadow-lg transition-all p-4 bg-white flex flex-col justify-between gap-1"
            >
              {product.productImage && (
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="w-[30vmin] self-center h-40 object-cover rounded mb-4"
                />
              )}
              <div className="flex-grow space-y-1">
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-sm text-green-600 font-medium">Off Price: ₹{product.offprice}</p>
                <p className="text-sm text-gray-800">Price: ₹{product.price}</p>
                {discount > 0 && (
                  <p className="text-sm text-red-500 font-semibold">
                    {discount}% off
                  </p>
                )}
                <p className="text-sm text-gray-500">Category: {product.category}</p>
                <p className="text-sm text-gray-500">In Stock: {product.stock}</p>
              </div>
              <button
                  onClick={() => handleUpdate(product._id)}
                  className="flex-1 bg-yellow-500 text-white py-1 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No products found.</p>
      )}
    </div>
  );
}

export default ManageProducts;

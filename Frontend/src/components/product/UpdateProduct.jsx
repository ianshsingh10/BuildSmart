import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../utils/constant";

function UpdateProduct() {
  const { companyId, productId } = useParams();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${Product}/single/${productId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCurrentProduct(res.data.product);
        setCompanyName(res.data.product.brand); // Assuming brand holds company name
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", currentProduct.name);
      formData.append("description", currentProduct.description);
      formData.append("price", currentProduct.price);
      formData.append(
        "offprice",
        currentProduct.offprice || currentProduct.price
      );
      formData.append("category", currentProduct.category);
      formData.append("stock", currentProduct.stock);
      formData.append("brand", companyName);
      if (currentProduct.file) {
        formData.append("productImage", currentProduct.file);
      }

      await axios.put(`${Product}/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/company/manage/${companyId}`);
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  };

  if (!currentProduct)
    return (
      <div className="text-center mt-10 text-gray-500">Loading product...</div>
    );

  const fields = [
    { key: "name", type: "text", placeholder: "Product Name" },
    { key: "description", type: "text", placeholder: "Product Description" },
    { key: "price", type: "number", placeholder: "Price" },
    { key: "offprice", type: "number", placeholder: "Offer Price" },
    { key: "category", type: "text", placeholder: "Category" },
    { key: "stock", type: "number", placeholder: "Stock" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Header with Back Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Update Product</h2>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      {/* Product Fields */}
      {fields.map((field) => (
        <div key={field.key} className="mb-4">
          <label
            htmlFor={field.key}
            className="block text-sm font-medium text-gray-700"
          >
            {field.placeholder}
          </label>
          <input
            id={field.key}
            type={field.type}
            placeholder={field.placeholder}
            value={currentProduct[field.key]}
            onChange={(e) =>
              setCurrentProduct({
                ...currentProduct,
                [field.key]: e.target.value,
              })
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      {/* File Upload */}
      <div className="mb-4">
        <label
          htmlFor="file-upload"
          className="block text-sm font-medium text-gray-700"
        >
          Upload Product Image
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={(e) =>
            setCurrentProduct({ ...currentProduct, file: e.target.files[0] })
          }
          className="mt-1 block w-full text-gray-700 py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => navigate(`/company/manage/${companyId}`)}
          className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Update Product
        </button>
      </div>
    </div>
  );
}

export default UpdateProduct;

import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../utils/constant";

function AddProduct() {
  const { companyId } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    offprice: "",
    category: "",
    stock: "",
    file: null,
    brand: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`${Product}/company/${companyId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const name = res.data.company.name;
        setCompanyName(name);
        setNewProduct((prev) => ({ ...prev, brand: name }));
      } catch (err) {
        console.error("Failed to fetch company:", err);
      }
    };
    fetchCompany();
  }, [companyId]);

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("offprice", newProduct.offprice || newProduct.price);
      formData.append("category", newProduct.category);
      formData.append("stock", newProduct.stock);
      formData.append("companyId", companyId);
      formData.append("brand", companyName);
      if (newProduct.file) {
        formData.append("productImage", newProduct.file);
      }

      await axios.post(`${Product}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate(`/company/manage/${companyId}`);
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 font-medium mb-4 inline-flex items-center hover:underline"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h2>

      <div className="grid grid-cols-1 gap-5">
        {[
          { name: "name", type: "text" },
          { name: "description", type: "text" },
          { name: "price", type: "number" },
          { name: "offprice", type: "number" },
          { name: "stock", type: "number" },
        ].map(({ name, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {name}
            </label>
            <input
              type={type}
              value={newProduct[name]}
              onChange={(e) =>
                setNewProduct({ ...newProduct, [name]: e.target.value })
              }
              className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${name}`}
            />
          </div>
        ))}
        {/* Category dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="cement">Cement</option>
            <option value="tiles">Tiles</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <input
            type="file"
            onChange={(e) =>
              setNewProduct({ ...newProduct, file: e.target.files[0] })
            }
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={() => navigate(`/company/manage/${companyId}`)}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}

export default AddProduct;

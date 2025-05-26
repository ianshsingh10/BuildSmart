import { useState } from "react";
import axios from "axios";
import { Company } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

function AddCompany({ onCompanyAdded }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    website: "",
    phone: "",
    email: "",
    logo: null,
    address: {
      street: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  const [message, setMessage] = useState("");
  const [logoError, setLogoError] = useState("");
  const navigate = useNavigate();

  const handleTopLevelChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, logo: file }));
      setLogoError("");
    }
  };

  const registerCompany = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("website", form.website);
    formData.append("phone", form.phone);
    formData.append("email", form.email);
    formData.append("address[street]", form.address.street);
    formData.append("address[city]", form.address.city);
    formData.append("address[state]", form.address.state);
    formData.append("address[pinCode]", form.address.pinCode);
    if (form.logo) formData.append("logo", form.logo);

    try {
      const res = await axios.post(`${Company}/register`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ type: "success", text: res.data.message });
      setForm({
        name: "",
        description: "",
        website: "",
        phone: "",
        email: "",
        logo: null,
        address: { street: "", city: "", state: "", pinCode: "" },
      });
      if (onCompanyAdded) onCompanyAdded();
      navigate("/companydashboard");
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Registration failed.",
      });
    }
  };

  const handleBackClick = () => {
    navigate("/companydashboard"); // Or navigate to the previous page using navigate(-1) if you want the exact previous page
  };
  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto my-10">
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
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Register a New Company
      </h2>
      <form onSubmit={registerCompany} className="space-y-8">
        {/* Basic company info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="name" className="text-gray-700 font-medium">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter Company Name"
              value={form.name}
              onChange={handleTopLevelChange}
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="website" className="text-gray-700 font-medium">
              Website
            </label>
            <input
              type="text"
              name="website"
              placeholder="Enter Website"
              value={form.website}
              onChange={handleTopLevelChange}
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="text-gray-700 font-medium">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Enter Phone Number"
              value={form.phone}
              onChange={handleTopLevelChange}
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="text-gray-700 font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleTopLevelChange}
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
              required
            />
          </div>
        </div>

        {/* Description Box */}
        <div className="form-group">
          <label htmlFor="description" className="text-gray-700 font-medium">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            placeholder="Enter Description"
            value={form.description}
            onChange={handleTopLevelChange}
            className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
            required
          />
        </div>

        {/* Address Box */}
        <div className="form-group">
          <fieldset className="border-2 border-gray-300 p-6 rounded-lg shadow-sm">
            <legend className="text-xl font-semibold text-gray-700">
              Address <span className="text-red-500">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="street" className="text-gray-700 font-medium">
                  Street <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  placeholder="Enter Street"
                  value={form.address.street}
                  onChange={handleAddressChange}
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city" className="text-gray-700 font-medium">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter City"
                  value={form.address.city}
                  onChange={handleAddressChange}
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="form-group">
                <label htmlFor="state" className="text-gray-700 font-medium">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter State"
                  value={form.address.state}
                  onChange={handleAddressChange}
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="pinCode" className="text-gray-700 font-medium">
                  Pin Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pinCode"
                  placeholder="Enter Pin Code"
                  value={form.address.pinCode}
                  onChange={handleAddressChange}
                  className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>
            </div>
          </fieldset>
        </div>

        {/* Logo Upload */}
        
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Logo</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleLogoChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200 transition"
          />
          {logoError && <p className="text-red-500 text-sm mt-1">{logoError}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 text-lg font-semibold bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
        >
          Register Company
        </button>
      </form>

      {/* Success or Error Message */}
      {message && (
        <div
          className={`mt-6 p-4 rounded-lg shadow-md ${
            message.type === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <div className="flex items-center">
            {message.type === "success" ? (
              <FiCheckCircle className="text-green-500 mr-2" />
            ) : (
              <FiXCircle className="text-red-500 mr-2" />
            )}
            <p
              className={`text-lg ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddCompany;

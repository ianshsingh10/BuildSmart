import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Company } from "../../utils/constant";

function EditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await axios.get(`${Company}/company/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const {
          name,
          description,
          website,
          phone,
          email,
          address,
        } = res.data.company;

        setForm({
          name,
          description,
          website: website || "",
          phone: phone || "",
          email: email || "",
          logo: null,
          address: {
            street: address?.street || "",
            city: address?.city || "",
            state: address?.state || "",
            pinCode: address?.pinCode || "",
          },
        });
      } catch (err) {
        console.error("Error loading company:", err);
      }
    }

    fetchCompany();
  }, [id]);

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
    setForm((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
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
      await axios.put(`${Company}/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Company updated successfully.");
      navigate("/companydashboard");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed.");
    }
  };

  const handleBackClick = () => {
    navigate("/companydashboard");
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-indigo-600">
        Edit Company
      </h2>

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

      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="form-group">
          <label htmlFor="name" className="text-gray-700 font-medium">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleTopLevelChange}
            placeholder="Company Name"
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="text-gray-700 font-medium">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleTopLevelChange}
            placeholder="Description"
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="website" className="text-gray-700 font-medium">
            Website
          </label>
          <input
            name="website"
            type="text"
            placeholder="Website"
            value={form.website}
            onChange={handleTopLevelChange}
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="text-gray-700 font-medium">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={handleTopLevelChange}
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email" className="text-gray-700 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleTopLevelChange}
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Address Section */}
        <fieldset className="border-t-2 pt-4 mt-6">
          <legend className="text-lg text-gray-800 font-semibold">Address</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div className="form-group">
              <label htmlFor="street" className="text-gray-700 font-medium">
                Street <span className="text-red-500">*</span>
              </label>
              <input
                name="street"
                type="text"
                placeholder="Street"
                value={form.address.street}
                onChange={handleAddressChange}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="city" className="text-gray-700 font-medium">
                City <span className="text-red-500">*</span>
              </label>
              <input
                name="city"
                type="text"
                placeholder="City"
                value={form.address.city}
                onChange={handleAddressChange}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                name="state"
                type="text"
                placeholder="State"
                value={form.address.state}
                onChange={handleAddressChange}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pinCode" className="text-gray-700 font-medium">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input
                name="pinCode"
                type="text"
                placeholder="Pin Code"
                value={form.address.pinCode}
                onChange={handleAddressChange}
                className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </fieldset>

        <div className="form-group mt-4">
          <label htmlFor="logo" className="text-gray-700 font-medium">
            Logo (Optional)
          </label>
          <input
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={handleLogoChange}
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="form-group mt-6">
          <button
            type="submit"
            className="w-full p-4 bg-indigo-600 text-white font-semibold rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCompany;

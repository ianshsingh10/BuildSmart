import { useEffect, useState } from "react";
import axios from "axios";
import { Company } from "../../utils/constant";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlus } from "react-icons/fa";

function CompanyDashboard() {
  const [companies, setCompanies] = useState([]);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const fetchUserRole = () => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setRole(storedRole);
      if (storedRole !== "seller") {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get(`${Company}/companies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCompanies(res.data.companies);
    } catch (error) {
      console.error("Error fetching companies", error);
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchCompanies();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-8 my-12 bg-gray-100 rounded-xl">
      <h1 className="text-4xl font-semibold mb-8 text-center text-indigo-600">
        Company Dashboard
      </h1>

      {role === "seller" ? (
        <>
          
          {/* Companies List */}
          <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">
              Your Registered Companies
            </h2>
            {companies.length === 0 ? (
              <p className="text-lg text-gray-500">No companies found.</p>
            ) : (
              <ul className="space-y-4">
                {companies.map((company) => (
                  <li
                    key={company._id}
                    className="border p-4 rounded-xl bg-gray-50 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      {company.logo && (
                        <img
                          src={company.logo}
                          alt="Logo"
                          className="w-16 h-16 rounded-lg"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-lg">{company.name}</p>
                        <p className="text-sm text-gray-600">
                          {company.location}
                        </p>
                        <p className="text-sm mt-1">
                          <strong>Status:</strong> {company.status || "Pending"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/company/edit/${company._id}`)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition w-full sm:w-auto"
                      >
                        Edit
                      </button>
                      {company.status === "registered" && (
                        <button
                          onClick={() => navigate(`/company/manage/${company._id}`)}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition w-full sm:w-auto"
                        >
                          Manage
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Add New Company Button */}
          <div className="mb-8 text-right">
            <button
              onClick={() => navigate("/company/add")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
            >
              <FaPlus /> Add New Company
            </button>
          </div>
        </>
      ) : (
        <p className="text-xl text-center text-red-500">
          You do not have permission to view this page.
        </p>
      )}
    </div>
  );
}

export default CompanyDashboard;

import React, { useState, useEffect } from "react";
import { Navigate, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import RegisterPage from "./components/RegisterPage";
import CompanyDashboard from "./components/company/companydashboard";
import EditCompany from "./components/company/EditCompany";
import AddCompany from "./components/company/addConpany";
import ManageProducts from "./components/product/ManageProduct";
import AddProduct from "./components/product/AddProduct";
import UpdateProduct from "./components/product/UpdateProduct";
import ProductDetail from "./components/product/ProductDetail";
import CartPage from "./components/CartPage";
import ApplyRole from "./components/ApplyRole";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setIsLoggedIn(true);
      setUsername(username);
    } else {
      console.log("errrrrrr");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role"); 
    setIsLoggedIn(false);
    setUsername("");
  };

  return (
    <Router>
      <Navbar
        isLoggedIn={isLoggedIn}
        username={username}
        setIsLoggedIn={setIsLoggedIn}
      />
      <div className="">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <LoginPage
              setIsLoggedIn={setIsLoggedIn}
              setUsername={setUsername}
            />
          }
        />
        <Route
          path="/profile"
          element={<ProfilePage handleLogout={handleLogout} />}
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/companydashboard" element={<CompanyDashboard />} />
        <Route path="/company/edit/:id" element={<EditCompany />}/>
        <Route path="/dashboard" element={<LandingPage />}/>
        <Route path="/company/add" element={<AddCompany />} />
        <Route path="/company/manage/:companyId" element={<ManageProducts />} />
        <Route path="/addproduct/:companyId" element={<AddProduct />} />
        <Route path="/updateproduct/:companyId/:productId" element={<UpdateProduct />} />
        <Route path="/product-detail/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/role" element={<ApplyRole />} />
      </Routes>
      </div>
    </Router>
  );
}

export default App;

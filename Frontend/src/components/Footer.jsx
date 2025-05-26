import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaGlobe } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">

        {/* Brand */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-4">BuildSmart</h3>
          <p className="text-sm leading-relaxed text-gray-400">
            Your one-stop shop for quality building materials delivered to your doorstep.
          </p>
          <div className="flex space-x-4 mt-4 text-lg">
            <a href="#" className="hover:text-white"><FaGlobe /></a>
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/products" className="hover:underline">Products</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/category/cement" className="hover:underline">Cement</Link></li>
            <li><Link to="/category/tiles" className="hover:underline">Tiles</Link></li>
            <li><Link to="/category/paint" className="hover:underline">Paint</Link></li>
            <li><Link to="/category/other" className="hover:underline">Other</Link></li>
          </ul>
        </div>

        {/* Get Involved */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Get Involved</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/role" className="hover:underline">Become a Seller</Link></li>
            <li><Link to="/role" className="hover:underline">Become a Delivery Partner</Link></li>
            <li><Link to="/role" className="hover:underline">Join Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
          <p className="text-sm text-gray-400">support@buildsmart.com</p>
          <p className="text-sm text-gray-400 mt-1">+91-9876543210</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} BuildSmart. All rights reserved.
      </div>
    </footer>
  );
}

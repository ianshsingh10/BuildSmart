import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Payment } from "../../utils/constant"; // This should be your backend base URL

export default function CheckoutPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!state || !state.items) {
      navigate("/cart");
      return;
    }
    setItems(state.items);

    const totalPrice = state.items.reduce(
      (sum, item) => sum + item.product.offprice * item.quantity,
      0
    );
    setTotal(totalPrice);
  }, [state, navigate]);

  // Load Razorpay checkout script
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    try {
      // Create order on backend
      const { data: order } = await axios.post(`${Payment}/create-order`, {
        amount: total, // Amount in rupees
      });

      if (!order || !order.id) {
        alert("Failed to create order. Please try again.");
        return;
      }
      console.log("Razorpay Key:", import.meta.env.VITE_RAZORPAY_KEY_ID);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Shop",
        description: "Order Payment",
        order_id: order.id,
 // Razorpay order ID from backend
        handler: async function (response) {
          // This runs on successful payment
          const orderData = {
            userId: "YOUR_USER_ID_HERE", // Replace with logged in user ID
            items: items.map((item) => ({
              productId: item.product._id,
              quantity: item.quantity,
              price: item.product.offprice,
            })),
            totalAmount: total,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          try {
            await axios.post(`${Payment}/save-order`, orderData);
            alert("Payment successful and order saved!");
            navigate("/orders");
          } catch (error) {
            alert("Payment successful but failed to save order.");
            console.error(error);
          }
        },
        prefill: {
          name: "Customer",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed", err);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {items.map((item) => (
        <div
          key={item.product._id}
          className="mb-4 flex items-center justify-between"
        >
          <div>
            <h2 className="font-medium">{item.product.name}</h2>
            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
          </div>
          <div>₹{item.product.offprice * item.quantity}</div>
        </div>
      ))}
      <div className="text-right mt-6">
        <h2 className="text-xl font-bold">Total: ₹{total}</h2>
        <button
          onClick={handlePayment}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}

import Razorpay from "razorpay";
import dotenv from "dotenv";
import Order from "../models/order.js"; // Your mongoose Order model

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const payment = async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  const options = {
    amount: amount * 100, // Convert rupees to paise
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
  console.log("Order from backend", order);
    return res.status(200).json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

// Save order details after successful payment
export const save = async (req, res) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    if (
      !userId ||
      !items ||
      items.length === 0 ||
      !totalAmount ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({ error: "Missing required order details" });
    }

    const newOrder = new Order({
      user: userId,
      items: items.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: "paid",
    });

    await newOrder.save();

    return res
      .status(201)
      .json({ message: "Order saved successfully", order: newOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    return res.status(500).json({ error: "Failed to save order" });
  }
};

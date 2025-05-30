import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userroute.js';
import companyRoute from './routes/companyroute.js';
import ProductRoute from './routes/productroute.js';
import CartRoute from './routes/cartroute.js';
import PaymentRoute from "./routes/paymentroute.js";
import connectDB from "./utils/db.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());

// Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,  // Allow credentials like cookies, authorization headers, etc.
  }));
  


// Routes
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/products", ProductRoute);
app.use("/api/cart", CartRoute);
app.use("/api/payment", PaymentRoute);

// Database connect
app.listen(PORT,()=>{
  connectDB();
  console.log(`Server running at port ${PORT}`);
})
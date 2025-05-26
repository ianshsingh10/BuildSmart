import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pinCode: { type: String, required: true },
      },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true, // URL to company logo
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "registered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;

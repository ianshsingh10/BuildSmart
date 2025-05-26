import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  street:     { type: String },
  city:       { type: String },
  state:      { type: String },
  country:    { type: String },
  postalCode: { type: String },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: true,
    trim:     true,
  },
  email: {
    type:      String,
    required:  true,
    unique:    true,
    lowercase: true,
  },
  phone: {
    type:     String,
  },
  addresses: {
    type:    [addressSchema],
    default: [],
  },
  role: {
    type:    String,
    enum:    ['user', 'admin', 'seller', 'delivery'],
    default: 'user',
  },
  password: {
    type: String,
    minlength: 6,
  },
  photo: {
    type: String, 
  }
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;

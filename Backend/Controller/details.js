import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const getUserDetails = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // return full user details
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

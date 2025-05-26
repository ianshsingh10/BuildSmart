import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const emailPasswordLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.password) {
      return res
        .status(400)
        .json({
          message: "This account uses Google login. Please login with Google.",
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
      });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Google Login Error:", error);
    res
      .status(500)
      .json({ message: "Google login failed", error: error.message });
  }
};

export const register = async (req, res) => {
  const { name, email, phone, addresses, role, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      phone,
      addresses,
      role,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { role, message } = req.body;

    if (!req.user?.id) {
      return res.status(400).json({ message: "Invalid user token" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { role },
      { new: true }
    );

    res.json({ message: "Role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

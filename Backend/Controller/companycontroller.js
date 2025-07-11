import Company from "../models/company.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register a company
export const registerCompany = async (req, res) => {
  try {
    const {
      name, description, website, phone, email,
      address: { street, city, state, pinCode }
    } = req.body;

    if (!name) return res.status(400).json({ message: "Company name is required." });

    const existing = await Company.findOne({ name });
    if (existing) return res.status(400).json({ message: "Company already exists." });

    let logo = "";
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloud = await cloudinary.uploader.upload(fileUri.content);
      logo = cloud.secure_url;
    }

    const company = await Company.create({
      name,
      description,
      website,
      address: { street, city, state, pinCode },
      phone,
      email,
      logo,
      userId: req.user.id
    });

    res.status(201).json({ message: "Company registered successfully.", company });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

// Get companies for a user
export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.user.id });
    if (!companies.length) {
      return res.status(404).json({ message: "No companies found.", success: false });
    }

    res.status(200).json({ companies, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Update a company
export const updateCompany = async (req, res) => {
  try {
    const {
      name, description, website, phone, email,
      address: { street, city, state, pinCode }
    } = req.body;

    const updateData = {
      name,
      description,
      website,
      address: { street, city, state, pinCode },
      phone,
      email
    };

    if (req.file) {
      const fileUri = getDataUri(req.file);
      const cloud = await cloudinary.uploader.upload(fileUri.content);
      updateData.logo = cloud.secure_url;
    }

    const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!company) {
      return res.status(404).json({ message: "Company not found.", success: false });
    }

    res.status(200).json({ message: "Company updated successfully.", company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getSingleCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ company });
  } catch (error) {
    console.error("Error fetching company:", error);
    res.status(500).json({ message: "Server error" });
  }
};

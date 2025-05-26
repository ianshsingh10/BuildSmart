import express from "express";
import {
  googleLogin,
  emailPasswordLogin,
  register,
  updateRole
} from "../Controller/usercontroller.js";
import { getUserDetails } from "../Controller/details.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/google", googleLogin);
router.post("/login", emailPasswordLogin);
router.post("/register", register);
router.get("/me", isAuthenticated, getUserDetails);
router.put("/role", isAuthenticated, updateRole);

export default router;

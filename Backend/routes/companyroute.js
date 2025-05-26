import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getCompany, registerCompany, updateCompany, getSingleCompany } from "../Controller/companycontroller.js";
import { singleUpload } from "../middleware/mutler.js";

const router = express.Router();

router.post("/register",isAuthenticated,singleUpload,registerCompany);
router.get("/companies",isAuthenticated,getCompany);
router.put('/update/:id', isAuthenticated, singleUpload, updateCompany);
router.get("/:id",isAuthenticated,getSingleCompany);

export default router;
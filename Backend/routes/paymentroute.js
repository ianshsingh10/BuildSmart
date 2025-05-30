import express from "express";
import { payment, save } from "../Controller/payment.js";

const router = express.Router();

router.post("/create-order", payment);
router.post("/save-order", save);

export default router;

import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectedRoute, createCheckoutSession); //stripe결제를 위한 세션생성

export default router;

import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  createCheckoutSession,
  saveOrderAfterPaymentSuccess,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectedRoute, createCheckoutSession); //stripe결제를 위한 세션생성
//prettier-ignore
router.post("/checkout-success-save-order", protectedRoute, saveOrderAfterPaymentSuccess); //결제 성공후 주문내역을 DB에 저장

export default router;

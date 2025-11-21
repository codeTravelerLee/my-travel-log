//주문내역과 관련된 라우트
import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { getOrderByStripeSessionId } from "../controllers/order.controller.js";

const router = express.Router();

//stripe주문내역 받아오기
router.get(
  `/stripe-order/:sessionId`,
  protectedRoute,
  getOrderByStripeSessionId
);

export default router;

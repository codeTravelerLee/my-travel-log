//주문내역과 관련된 라우트
import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  getOrderByStripeSessionId,
  getOrderHistoryByUserId,
} from "../controllers/order.controller.js";

const router = express.Router();

//stripe주문내역 받아오기
router.get(
  `/stripe-order/:sessionId`,
  protectedRoute,
  getOrderByStripeSessionId
);

//사용자id로 주문내역 불러오기
router.get("/order-history", protectedRoute, getOrderHistoryByUserId);

export default router;

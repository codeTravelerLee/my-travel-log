import express from "express";

import { protectedRoute } from "../middleware/protectedRoute.js";
import sellerRoute from "../middleware/sellerRoute.js";

import {
  createCouponForStore,
  getCoupons,
  validateCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getCoupons); //특정 사용자가 가진 쿠폰 조회

router.post("/", protectedRoute, sellerRoute, createCouponForStore); //사장님이 자신의 가게에서 사용 가능한 쿠폰을 생성
router.post("/validate", protectedRoute, validateCoupon); //쿠폰 사용전 검증

export default router;

import express from "express";

import { protectedRoute } from "../middleware/protectedRoute.js";
import { adminRoute } from "../middleware/adminRoute.js";

import {
  createCouponForUsers,
  getCoupons,
  validateCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getCoupons); //특정 사용자가 가진 쿠폰 조회

router.post(
  "/admin/publishment",
  protectedRoute,
  adminRoute,
  createCouponForUsers
); //admin이 쿠포
router.post("/validate", protectedRoute, validateCoupon); //쿠폰 사용전 검증

export default router;

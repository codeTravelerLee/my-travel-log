import express from "express";

import { protectedRoute } from "../middleware/protectedRoute.js";
import { adminRoute } from "../middleware/adminRoute.js";

import {
  claimCoupon,
  generateCouponForUsers,
  getCoupons,
  validateCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getCoupons); //특정 사용자가 가진 쿠폰 조회

//prettier-ignore
router.post("/admin/publishment", protectedRoute, adminRoute, generateCouponForUsers); //admin이 쿠폰을 생성
router.post("/:code", protectedRoute, claimCoupon); //일반 사용자가 쿠폰을 다운받음
router.post("/validate", protectedRoute, validateCoupon); //쿠폰 사용전 검증

export default router;

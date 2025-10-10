import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { getCoupons } from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getCoupons); //특정 사용자가 가진 쿠폰 조회

export default router;

// 여행 상품 거래를 위한 API들의 routes

import express from "express";
import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
} from "../controllers/product.controller.js";

import { protectedRoute } from "../middleware/protectedRoute.js";
import sellerRoute from "../middleware/sellerRoute.js";

const router = express.Router();

//routes
router.get("/", getAllProducts); //모든 상품 조회
router.get("/featured", protectedRoute, getFeaturedProducts); //즐겨찾기한 상품 조회

router.post("/", protectedRoute, sellerRoute, createProduct); //판매할 상품을 등록, 사장님회원만 접근 가능

export default router;

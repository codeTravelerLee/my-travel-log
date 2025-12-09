// 여행 상품 거래를 위한 API들의 routes

import express from "express";
import {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getProductsByCategory,
  getProductsBySeller,
  searchProducts,
} from "../controllers/product.controller.js";

import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

//routes
router.get("/", getAllProducts); //모든 상품 조회
router.get("/:id", getProductById); //id에 맞는 상품 조회
router.get("/search", searchProducts); //상품 검색
router.get("/:sellerId", getProductsBySeller); //가게별 전체상품 조회
router.get("/featured/:sellerId", protectedRoute, getFeaturedProducts); //각 쇼핑몰마다 해당 몰의 사장님이 주력상품으로 등록한 상품들을 보여줌
router.get("/category/:category", getProductsByCategory); //특정 카테고리에 속한 모든 상품 조회

export default router;

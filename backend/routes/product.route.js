// 여행 상품 거래를 위한 API들의 routes

import express from "express";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
} from "../controllers/product.controller.js";

import { protectedRoute } from "../middleware/protectedRoute.js";
import sellerRoute from "../middleware/sellerRoute.js";

const router = express.Router();

//routes
router.get("/", getAllProducts); //모든 상품 조회
router.get("/featured/:sellerId", protectedRoute, getFeaturedProducts); //각 쇼핑몰마다 해당 몰의 사장님이 주력상품으로 등록한 상품들을 보여줌
router.get("/category/:category", getProductsByCategory); //특정 카테고리에 속한 모든 상품 조회

router.post("/", protectedRoute, sellerRoute, createProduct); //판매할 상품을 등록, 사장님회원만 접근 가능

router.delete("/:id", protectedRoute, sellerRoute, deleteProductById); //id에 맞는 상품 삭제
export default router;

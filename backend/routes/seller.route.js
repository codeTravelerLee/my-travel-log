import express from "express";

import { protectedRoute } from "../middleware/protectedRoute.js";
import sellerRoute from "../middleware/sellerRoute.js";

import {
  createProduct,
  deleteAllProductsBySeller,
  deleteProductById,
  featureProduct,
  getShopOverview,
  updateProductById,
} from "../controllers/seller.controller.js";

const router = express.Router();

//가게의 전체 회원수, 상품수, 수익등의 개괄정보를 가져옴
router.get("/overview", protectedRoute, sellerRoute, getShopOverview);

router.post("/", protectedRoute, sellerRoute, createProduct); //판매할 상품을 등록, 사장님회원만 접근 가능
router.post("/featured/:id", protectedRoute, sellerRoute, featureProduct); //상품을 주력 상품으로 등록하기

router.patch("/:id", protectedRoute, sellerRoute, updateProductById); //상품정보 수정

router.delete("/:id", protectedRoute, sellerRoute, deleteProductById); //id에 맞는 상품 삭제
//prettier-ignore
router.delete("/:sellerId/all", protectedRoute, sellerRoute, deleteAllProductsBySeller); // 특정 가게에서 올린 상품 전체 삭제

export default router;

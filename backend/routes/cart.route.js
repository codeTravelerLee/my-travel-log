import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  addToCart,
  changeCartQuantity,
  getCartItems,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getCartItems); // 장바구니 담은 상품 받아오기
router.post("/:id", protectedRoute, addToCart); //장바구니 담기
router.delete("/:id", protectedRoute, removeFromCart); //장바구니 담기 취소
router.patch("/:id", protectedRoute, changeCartQuantity); //장바구니 담은 수량 변경

export default router;

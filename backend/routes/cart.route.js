import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  addToCart,
  changeCartQuantity,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/:id", protectedRoute, addToCart); //장바구니 담기
router.delete("/:id", protectedRoute, removeFromCart); //장바구니 담기 취소
router.patch("/:id", protectedRoute, changeCartQuantity); //장바구니 담은 수량 변경

export default router;

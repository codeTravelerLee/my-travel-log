// 여행 상품 거래를 위한 API들의 routes

import express from "express";
import { getAllProducts } from "../controllers/product.controller.js";

const router = express.Router();

//routes
router.get("/", getAllProducts); //모든 상품 조회

export default router;

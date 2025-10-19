import express from "express";

import { protectedRoute } from "../middleware/protectedRoute.js";
import sellerRoute from "../middleware/sellerRoute.js";

import { getShopOverview } from "../controllers/seller.controller.js";

const router = express.Router();

//가게의 전체 회원수, 상품수, 수익등의 개괄정보를 가져옴
router.get("/overview", protectedRoute, sellerRoute, getShopOverview);

export default router;

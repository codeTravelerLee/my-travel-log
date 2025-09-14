import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

//프로필 정보 가져오기
router.get("/profile/:userName", protectedRoute, getUserProfile);

export default router;

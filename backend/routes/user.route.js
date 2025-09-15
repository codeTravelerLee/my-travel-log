import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  followOrUnfollowUser,
  getRecommendedUser,
  getUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

//프로필 정보 가져오기
router.get("/profile/:userName", protectedRoute, getUserProfile);
//추천 유저 받아오기
router.get("/recommend", protectedRoute, getRecommendedUser);
//팔로우 & 언팔로우
router.post("/follow/:id", protectedRoute, followOrUnfollowUser);

export default router;

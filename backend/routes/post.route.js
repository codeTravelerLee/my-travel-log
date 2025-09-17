import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
//prettier-ignore
import { commentPost, deletePost, getAllPosts, getLikedPosts, likePost, updatePost, uploadPost } from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", getAllPosts); //모든 게시글 가져오기 -> 로그인 안해도 이용가능

//protectedRoute를 거치는 것들은 로그인된 사용자에게만 허용된 기능들임
router.get("/likedPosts/:id", protectedRoute, getLikedPosts); //특정 사용자가 좋아요 누른 게시글들만 가져옴
router.post("", protectedRoute, uploadPost); //게시물 업로드
router.post("/like/:id", protectedRoute, likePost); //게시물 좋아요
router.post("/comment/:id", protectedRoute, commentPost); //댓글달기

router.put("/:id", protectedRoute, updatePost); //게시글 수정

router.delete("/:id", protectedRoute, deletePost); //게시물 삭제

//default내보내기 하면 내가 원하는 이름으로 import가능
export default router;

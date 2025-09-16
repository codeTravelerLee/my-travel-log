import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
//prettier-ignore
import { commentPost, deletePost, likePost, updatePost, uploadPost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("", protectedRoute, uploadPost); //게시물 업로드
router.post("/like/:id", protectedRoute, likePost); //게시물 좋아요
router.post("/comment/:id", protectedRoute, commentPost); //댓글달기
router.put("/:id", protectedRoute, updatePost); //게시글 수정
router.delete("/:id", protectedRoute, deletePost); //게시물 삭제

//default내보내기 하면 내가 원하는 이름으로 import가능
export default router;

import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  commentPost,
  deletePost,
  getAllPosts,
  getFollowingPosts,
  getLikedPosts,
  getProfilePosts,
  getSpecificUserLikedPosts,
  getSpecificUserProfilePosts,
  likePost,
  updatePost,
  uploadPost,
} from "../controllers/post.controller.js";
import { get } from "mongoose";

const router = express.Router();

router.get("/all", getAllPosts); //모든 게시글 가져오기 -> 로그인 안해도 이용가능

//protectedRoute를 거치는 것들은 로그인된 사용자에게만 허용된 기능들임
//아래의 두 liked, following의 경우, protectedRoute를 통해 설정된 req.user._id를 컨트롤러 안에서 받아오기에 dynamic파라미터 설정 안함
router.get("/liked", protectedRoute, getLikedPosts); //로그인된 사용자가 좋아요 누른 게시글들만 가져옴
router.get("/following", protectedRoute, getFollowingPosts); //로그인된 사용자가 팔로우하는 사람들의 게시글만 가져오기
router.get("/profile", protectedRoute, getProfilePosts); //프로필에 리스트업 할 자신이 작성한 글들 가져오기
router.get("/profile/:userName", protectedRoute, getSpecificUserProfilePosts); //userName에 맞는 사용자가 작성한 글을 모아줌
router.get("/liked/:userName", protectedRoute, getSpecificUserLikedPosts); //userName에 맞는 사용자가 좋아요 누른 글을 모아줌

router.post("", protectedRoute, uploadPost); //게시물 업로드
router.post("/like/:id", protectedRoute, likePost); //게시물 좋아요
router.post("/comment/:id", protectedRoute, commentPost); //댓글달기

router.put("/:id", protectedRoute, updatePost); //게시글 수정

router.delete("/:id", protectedRoute, deletePost); //게시물 삭제

//default내보내기 하면 내가 원하는 이름으로 import가능
export default router;

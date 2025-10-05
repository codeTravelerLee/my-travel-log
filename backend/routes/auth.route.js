import express from "express";
import {
  getCurrentUser,
  logIn,
  logOut,
  refreshAccessToken,
  signUp,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/signUp", signUp); //회원가입
router.post("/logIn", logIn); //로그인
router.post("/logOut", protectedRoute, logOut); //로그아웃

//액세스 토큰 갱신
router.post("/refreshToken", protectedRoute, refreshAccessToken);

//클라이언트에서 비밀번호 수정시, 현재 비밀번호가 맞는지 확인하는 API
// router.post("/verifyPassword", protectedRoute, verifyPassword);

//현재 로그인되어있는 계정의 정보를 받아오는 api(로그인된 프로필 정보 받아오기)
//먼저 protectedRoute함수 수행되고, 내부의 next()로직으로 인해 다음 인자인 getCurrentUser컨트롤러 수행
//요청을 보내는 클라이언트가 유효한 토큰을 가지고 있는지 먼저 확인해주고, 토큰 정보와 일치하는 user객체를 password제외하고 전달(protectedRoute함수의 역할)
router.get("/getCurrentUser", protectedRoute, getCurrentUser);

export default router;

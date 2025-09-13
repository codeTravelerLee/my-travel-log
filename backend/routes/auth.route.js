import express from "express";
import { logIn, logOut, signUp } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signUp", signUp); //회원가입
router.post("/logIn", logIn); //로그인
router.post("/logOut", logOut); //로그아웃

export default router;

import jwt from "jsonwebtoken";
import redis from "../../db/redis.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  //리프레시 토큰을 레디스에 저장
  const storeRefreshToken = async () => {
    await redis.set(
      `refresh_token_${userId}`,
      refreshToken,
      "EX",
      7 * 24 * 60 * 60
    ); //레디스의 EX는 초단위
  };

  storeRefreshToken();

  //액세스 토큰 쿠키에 저장
  res.cookie("access_token", accessToken, {
    maxAge: 15 * 60 * 1000, //밀리초이므로 15분
    httpOnly: true, //XSS방지
    sameSite: "strict", //CSRF방지
    secure: process.env.NODE_ENV !== "development", //프로덕션 환경에서만 https
  });

  //리프레시 토큰 쿠키에 저장
  res.cookie("refresh_token", refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7일
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
};

import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //밀리초이므로 15일
    httpOnly: true, //XSS방지
    sameSite: "strict", //CSRF방지
    secure: process.env.NODE_ENV !== "development", //프로덕션 환경에서만 https
  });
};

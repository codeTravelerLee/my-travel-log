

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; //jwt라는 이름의 쿠키값을 가져옴, cookieParser설정완료

    //토큰이 없다면 로그인부터 할 것!
    if (!token) {
      return res.status(404).json({ error: "먼저 로그인을 해주세요." });
    }

    //토큰값 검증
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); //성공하면 payload값 반환(여기선 userId. generateToken.js참조)

    //토큰 verify결과 falsy하다면
    if (!decodedToken) {
      return res.status(404).json({ error: "접근 권한이 없습니다!" }); //게시물 삭제 수정 등등 접근권한 없음
    }

    //verify를 거친 decodedToken엔 payload인 userId가 담겨있음
    //현재 토큰의 userId와 일치하는 user데이터를 찾음
    //클라이언트에 민감정보인 password는 제외하고 전달
    const user = await User.findById(decodedToken.userId).select("-password");

    //user정보가 없다면
    if (!user) {
      return res
        .status(404)
        .json({ error: "일치하는 사용자 정보를 찾을 수 없어요!" });
    }

    //모든 검증이 완료되었다면!! 최종보스 !!!
    //req객체에 user값 추가 -> 컨트롤러에서 req.user로 password를 제외한 user데이터의 정보 접근 가능
    req.user = user;

    //라우터에 다음 인자로 전달된 getCurrentUser컨트롤러가 수행되게 해줌
    //위의 코드들 덕에 getCurrentUser컨트롤러에선 req.user값을 사용할 수 있음. well done!
    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

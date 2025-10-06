// 상품을 판매할 수 있는 권한체크 라우트
// "사장님 등록하기" 라는 이름아래, seller role이 부여된 사람만 접근 가능한 기능들에 활용할 미들웨어

const sellerRoute = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    next();
  } else {
    return res
      .status(403)
      .json({ error: "사장님으로 등록된 사용자만 물품을 판매할 수 있어요!" });
  }
};

export default sellerRoute;

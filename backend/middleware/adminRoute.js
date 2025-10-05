// 관리자 계정만 접근할 수 있도록 해주는 미들웨어

export const adminRoute = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ error: "접근 권한이 없어요!" }); //403 forbidden
  }
};

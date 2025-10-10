// 쿠폰과 관련된 APIs

import Coupon from "../models/coupon.model.js";

//해당 사용자가 가진 쿠폰 찾아옴
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ user: req.user._id });

    res
      .status(200)
      .json({ message: "회원님이 보유한 쿠폰들을 가져왔어요.", data: coupons });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "internal server error. progress: getCoupons" });
  }
};

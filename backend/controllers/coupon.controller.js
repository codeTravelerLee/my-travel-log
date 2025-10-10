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

//쿠폰 검증
export const validateCoupon = async (req, res) => {
  try {
    // cartItems, totalAmount는 isValid에서 사용
    const { code, cartItems, totalAmount } = req.body; //쿠폰의 고유 식별코드
    const { _id: userId } = req.user;

    const coupon = await Coupon.findOne({ code: code });

    //필요한 값들이 body에 다 제공되었는지 쳌
    if (!code || !cartItems || !totalAmount)
      return res.status(400).json({ error: "필수 필드를 전부 입력해주세요" });

    //존재하지 않는 쿠폰일 경우
    if (!coupon)
      return res.status(404).json({ error: "존재하지 않는 쿠폰입니다." });

    //해당 쿠폰의 주인이 맞는지 확인
    if (coupon.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "쿠폰의 주인만 사용할 수 있어요." });
    }

    //model의 isvalid헬퍼함수 적용 -> 유효성 검증
    if (!coupon.isValid(cartItems, totalAmount)) {
      coupon.isActive = false;
      await coupon.save();

      return res.status(400).json({ error: "사용할 수 없는 쿠폰입니다" });
    }

    //유효하다면
    res.status(200).json({ message: "유효한 쿠폰입니다!", data: coupon });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "internal server error. progress: validateCoupon" });
  }
};

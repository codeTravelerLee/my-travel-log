import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    //쿠폰의 고유 코드
    code: {
      type: String,
      required: true,
      unique: true,
    },
    //쿠폰 이름
    name: {
      type: String,
      required: true,
    },
    //쿠폰 상세정보
    description: {
      type: String,
      default: "",
    },
    //쿠폰 발급일
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    //쿠폰 만료일
    expireDate: {
      type: Date,
      required: true,
    },
    //현재 사용가능한 상태인가
    isActive: {
      type: Boolean,
      default: true,
    },
    //퍼센트 혹은 일정금액
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    //할인 값(type에 따라 퍼센트 혹은 금액이 될 것)
    discountValue: {
      type: Number,
      min: 0,
      required: true,
    },
    //해당 쿠폰을 사용하기 위한 최소주문금액
    minPurchaseAmount: {
      type: Number,
      min: 0,
      required: true,
    },
    //쿠폰 사용가능 횟수
    maxUsage: {
      type: Number,
      default: 1,
    },
    //해당 쿠폰을 몇 번 사용했는지
    usedCount: {
      type: Number,
      default: 0,
    },
    //해당 쿠폰을 사용할 수 있는 카테고리(optional)
    applicableCategories: [
      {
        type: String,
      },
    ],
    //해당 쿠폰 적용 가능한 상품(optional)
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    // 해당 쿠폰의 주인
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 쿠폰이 사용가능한지 검증해주는 헬퍼 메소드
// totalAmount : 구매액
// cartItems: 쿠폰을 적용할 장바구니 담은 상품들(배열)
couponSchema.methods.isValid = function (cartItems = [], totalAmount = 0) {
  const now = new Date();

  //쿠폰 기한, 사용가능횟수, 최소주문금액 제한 준수여부 검증
  if (
    !this.isActive ||
    now < this.startDate ||
    now > this.expireDate ||
    this.usedCount >= this.maxUsage ||
    totalAmount < this.minPurchaseAmount
  )
    return false;

  //해당 쿠폰에 applicableCategory가 지정되어 있다면 해당하는지 검증
  if (this.applicableCategories.length > 0) {
    const isCouponValid = cartItems.some((item) =>
      this.applicableCategories.includes(item.category)
    );

    if (!isCouponValid) return false;
  }

  //해당 쿠폰에 applicableProducts가 지정되어 있다면 해당하는지 검증
  if (this.applicableProducts.length > 0) {
    const isCouponValid = cartItems.some((item) =>
      this.applicableProducts.some(
        (id) => id.toString() === item.productId.toString()
      )
    );

    if (!isCouponValid) return false;
  }

  //모든 조건이 유효한 경우
  return true;
};

const Coupon = new mongoose.model("Coupon", couponSchema);

export default Coupon;

//결제를 위한 APIs

import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";

import { stripe } from "../lib/payments/stripe.js";
import User from "../models/user.model.js";

//stripe결제 호환 API
export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, couponCode } = req.body;

    //cartItems는 배열이며 원소가 1개 이상이어야 함
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res
        .status(400)
        .json({ error: "상품데이터가 올바르게 입력되지 않았습니다." });
    }

    //결제할 각각의 상품들의 정보를 담은 배열
    //각각의 상품들을 순회하며 stripe API가 요구하는 형태로 변환
    //cartItems는 주문서 스키마의 구조를 따름
    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.productId).select("image");
        item.image = product.image; //stripe API에는 이미지를 제공해야 하는데, 주문서 스키마엔 이미지가 없으므로 상품 스키마에서 이미지를 가져옴

        return {
          price_data: {
            currency: "krw",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: unitAmount,
          },
          quantity: item.quantity || 1,
        };
      })
    );

    //고객이 지불해야할 최종 금액
    let totalAmount = 0;

    totalAmount = lineItems.reduce(
      (sum, item) => sum + item.price_data.unit_amount * item.quantity,
      0
    );

    //쿠폰코드가 제공되면
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode,
        isActive: true,
      });

      if (!coupon) {
        return res.status(404).json({ error: "존재하지 않는 쿠폰입니다" });
      }

      //쿠폰 모델에 구현해둔 유효성 검증 isValid메소드
      if (!coupon.isValid(lineItems, totalAmount, req.user._id, coupon._id)) {
        return res.status(422).json({ error: "쿠폰을 사용할 수 없어요." });
      }

      // 쿠폰이 유효한 경우 fixed, percentage각각의 할인 유형에 따라 totalAmount값에 할인적용
      switch (coupon.discountType) {
        case "percent":
          totalAmount -= totalAmount * (coupon.discountValue / 100);
          break;
        case "fixed":
          totalAmount -= coupon.discountValue;
          break;
        default:
          return res
            .status(400)
            .json({ error: "올바르지 않은 쿠폰 할인유형입니다." });
      }
    }

    //쿠폰 전체가 아니라, 사용한 유저가 가진 쿠폰만 만료시켜야함.
    const coupon = await Coupon.findOne({
      code: couponCode,
      isActive: true,
    });

    const user = await User.findById(req.user._id).select("-password");
    const couponToUse = user.coupons.find(
      (c) => c.couponId.toString() === coupon._id
    );

    //쿠폰 사용횟수를 1증가시킴
    couponToUse.usedCount += 1;

    if (couponToUse.usedCount >= coupon.maxUsage) {
      couponToUse.available = false;
    }

    //변경된 사항 DB반영
    await user.save();

    //stripe 결제세션 생성
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${process.env.CLIENT_URI}/payment-success?session_id={{CHECKOUT_SESSION_ID}}`,
      cancel_url: `${process.env.CLIENT_URI}/payment-cancel`,
      discounts: coupon
        ? [
            {
              //coupon을 stripe API에 호환되는 형식으로 생성하는 커스텀 함수
              coupon: await convertToStripeCoupon(
                coupon.discountType,
                coupon.discountValue
              ),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          cartItems.map((item) => ({
            id: item._id,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      },
    });

    res.status(200).json({ id: session.id, totalAmount: totalAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "internal server error. progress: createCheckoutSession with stripe API",
    });
  }
};

//마이트래블로그의 쿠폰을 Stripe API형태로 변환(createCheckoutSession 컨트롤러에서 호출)
async function convertToStripeCoupon(discountType, discountValue) {
  let couponData = {
    duration: "once",
  };

  switch (discountType) {
    case "percent":
      couponData.percent_off = discountValue;
      break;
    case "fixed":
      couponData.amount_off = discountValue;
      couponData.currency = "krw";
      break;
    default:
      throw new Error("올바르지 않은 형식의 쿠폰 할인 유형입니다. ");
  }

  const coupon = await stripe.coupons.create(couponData);
  return coupon.id;
}

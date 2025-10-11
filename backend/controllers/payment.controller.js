//결제를 위한 APIs

import Product from "../models/product.model.js";

//stripe결제를 위한 결제 순간의 세션 생성
export const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems, couponCode } = req.body;

    //cartItems는 배열이며 원소가 1개 이상이어야 함
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res
        .status(400)
        .json({ error: "상품데이터가 올바르게 입력되지 않았습니다." });
    }

    //고객이 지불해야할 최종 금액
    let totalAmount = 0;

    //결제할 각각의 상품들의 정보를 담은 배열
    //각각의 상품들을 순회하며 stripe API가 요구하는 형태로 변환
    //cartItems는 주문서 스키마의 구조를 따름
    const lineItems = await Promise.all(
      cartItems.map(async (item) => {
        const unitAmount = item.price; //개당 가격
        totalAmount += unitAmount * item.quantity; //상품들 순회하며 결제총액에 누적합

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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error:
        "internal server error. progress: createCheckoutSession with stripe API",
    });
  }
};

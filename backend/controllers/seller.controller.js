//각 가게의 사장님(seller role을 가진) 회원의 가게관리 페이지 APIs

import mongoose from "mongoose";

import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

//해당 가게의 overview정보제공
export const getShopOverview = async (req, res) => {
  try {
    const shopId = new mongoose.Types.ObjectId(req.user._id);

    //가게 내 등록된 상품의 수
    const shopProductCount = await Product.countDocuments({
      seller: shopId,
    });

    //가게에서 결제된 주문건수, 주문총액 데이터
    const shopOrderData = await Order.aggregate([
      // cartItems 배열을 펼침
      { $unwind: "$cartItems" },

      // Product 컬렉션과 조인
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },

      // 현재 shopId의 상품만 필터링
      {
        $match: {
          "productInfo.seller": shopId,
        },
      },

      // 주문 수와 매출 합계 계산
      {
        $group: {
          _id: null,
          shopOrderCount: { $sum: 1 }, // 해당 가게 상품이 포함된 주문 아이템 수
          shopTotalRevenue: {
            $sum: { $multiply: ["$cartItems.price", "$cartItems.quantity"] },
          },
        },
      },
    ]);

    const { shopOrderCount = 0, shopTotalRevenue = 0 } = shopOrderData[0] || {};

    //가게 정보 데이터를 취합
    const shopOverviewData = {
      shopProductCount,
      shopOrderCount,
      shopTotalRevenue,
    };

    res
      .status(200)
      .json({ message: "가게 정보 불러오기 성공!", data: shopOverviewData });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

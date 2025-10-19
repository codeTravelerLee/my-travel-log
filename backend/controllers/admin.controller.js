import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

//어드민 페이지에서 전체 회원수, 상품수, 총 주문수 등을 간략히게 보여주는 API
export const getAdminOverview = async (req, res) => {
  try {
    //USER COLLECTION
    const totalUserCount = await User.countDocuments(); //전체 서비스 회원의 수
    //prettier-ignore
    const sellerUserCount = await User.countDocuments({ role: { $eq: "seller" }, }); //판매자 회원의 수 == 서비스 내 전체 가게의 수

    //PRODUCT COLLECTION
    const totalProductCount = await Product.countDocuments(); //서비스 내 등록된 전체 상품의 수

    //ORDER COLLECTION -> 서비스 전체의 주문건수, 주문금액
    const orderData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrderCount: { $sum: 1 }, //서비스 내 전체 주문 건수
          totalOrderRevenue: { $sum: "$totalAmount" }, //서비스 내 전체 주문금액
        },
      },
    ]);

    const { totalOrderCount, totalOrderRevenue } = orderData[0] || {
      totalOrderCount: 0,
      totalOrderRevenue: 0,
    };

    //정보들을 종합
    const adminOverviewData = {
      totalUserCount, //전체 회원수
      sellerUserCount, //가게 수(seller회원 수)
      totalProductCount, //서비스에 등록된 상품의 총 개수
      totalOrderCount, // 서비스에서 이뤄진 결제건수(주문건수)
      totalOrderRevenue, // 서비스에서 이뤄진 결제의 금액 총합
    };

    res
      .status(200)
      .json({ message: "서비스 정보 불러오기 성공!", data: adminOverviewData });
  } catch (error) {
    console.error(
      "어드민 페이지 정보를 불러오는 도중 오류가 발생했어요.",
      error
    );
    res
      .status(500)
      .json({ error: "internal server error. progress: getAdminOverview" });
  }
};

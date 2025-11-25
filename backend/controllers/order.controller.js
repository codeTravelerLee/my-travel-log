//주문내역과 관련된 API

import Order from "../models/order.model.js";

//stripe결제내역을 sessionId로 불러오기
export const getOrderByStripeSessionId = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const order = await Order.findOne({
      stripeSessionId: sessionId,
      isDeleted: false,
    }).populate({
      path: "cartItems.productId",
      select: "name image category",
    });

    res
      .status(200)
      .json({ message: "주문내역을 성공적으로 불러왔어요!", orderData: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};

//사용자의 주문내역을 사용자 id로 불러오기
export const getOrderHistoryByUserId = async (req, res) => {
  try {
    const orderHistoryArray = await Order.find({
      user: req.user._id,
      isDeleted: false,
    }).populate({ path: "cartItems.productId", select: "name image" });

    res.status(200).json({
      message: "주문내역을 불러왔어요!",
      orderData: orderHistoryArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};

//주문내역 삭제
export const deleteOrderHistory = async (req, res) => {};

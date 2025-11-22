//주문내역과 관련된 API

import Order from "../models/order.model.js";

//stripe결제내역을 sessionId로 불러오기
export const getOrderByStripeSessionId = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const order = await Order.findOne({ stripeSessionId: sessionId }).populate({
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

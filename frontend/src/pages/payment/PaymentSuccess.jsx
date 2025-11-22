import React from "react";
import {
  getStripeOrderBySessionId,
  saveOrderAfterStripePayment,
} from "../../utils/axios/payments";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const PaymentSuccess = async () => {
  const navigate = useNavigate();

  //쿼리스트링에서 session_id추출
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const sessionId = params.get("session_id");

  //주문내역 저장

  await saveOrderAfterStripePayment(sessionId);

  //주문내역 불러오기
  const { message, orderData } = await getStripeOrderBySessionId(sessionId);
  toast.success(message);

  console.log("order data:", orderData);

  return (
    <div className="flex flex-col justify-center items-center">
      <p>주문이 성공적으로 완료되었어요!</p>
      <div>
        주문한 상품들:{" "}
        {orderData.cartItems.map((item) => (
          <div>
            <p>{item.price}</p>
            <p>{item.productId.name}</p>
            <p>{item.quantity}</p>
            <p>{(item.price * item.quantity).toLocaleString("ko-kr")}</p>
          </div>
        ))}
      </div>
      <p>총 주문금액: {orderData.totalAmount.toLocaleString("ko-kr")}원</p>
    </div>
  );
};

export default PaymentSuccess;

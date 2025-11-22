//사용자가 stripe결제를 취소한 경우

import React from "react";
import { Link } from "react-router-dom";

//TODO: 결제 취소시 제품의 재고를 늘려줘야 함
const PaymentCancel = () => {
  return (
    <div className="flex flex-col justify-center items-center text-5xl">
      <p>결제가 취소되었습니다.</p>
      <Link to={"/carts"}>장바구니 보기</Link>
      <Link to={"/"}>홈으로</Link>
    </div>
  );
};

export default PaymentCancel;

//사용자가 stripe결제를 취소한 경우

import React from "react";
import { Link } from "react-router-dom";

//TODO: 결제 취소시 제품의 재고를 늘려줘야 함
//TODO: 결제취소 로직에서 고려해야할 모든경우의 수를 생각해볼것
const PaymentCancel = () => {
  return (
    <div className="flex flex-col gap-10 justify-center items-center text-5xl h-full">
      <p>결제가 취소되었습니다.</p>
      <div className="flex gap-2">
        <Link to={"/carts"}>
          <p className="border rounded-lg p-3 text-2xl hover:cursor-pointer hover:bg-white hover:text-black">장바구니 보기</p>
        </Link>
        <Link to={"/"}>
          <p className="border rounded-lg p-3 text-2xl hover:cursor-pointer hover:bg-white hover:text-black">홈으로 </p>
        </Link>
      </div>
    </div>
  );
};

export default PaymentCancel;

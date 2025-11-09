import React, { useEffect, useState } from "react";

const TotalPriceView = ({ cartItems }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  //결제할 총액을 계산하는 함수
  const calculateTotalPrice = () => {
    const total = cartItems.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    setTotalPrice(total);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  return (
    <div className="rounded-lg p-10 bg-gray-200 h-1/2 mt-6 ">
      <p className="text-black text-xl font-bold">
        결제하실 총 금액:{" "}
        <span className="text-red-600">
          {totalPrice.toLocaleString("ko-KR")}원
        </span>
      </p>
    </div>
  );
};

export default TotalPriceView;

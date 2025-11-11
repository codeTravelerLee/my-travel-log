//결제수단 선택 버튼
import React from "react";

const PaymentMethodButton = ({ name, bgColor, fontColor, onClick }) => {
  return (
    <button
      className="text-center rounded-lg w-1/3 p-3 font-extrabold text-2xl italic"
      style={{ backgroundColor: bgColor, color: fontColor }}
      onClick={onClick}
    >
      {name}
    </button>
  );
};

export default PaymentMethodButton;

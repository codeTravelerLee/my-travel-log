//주문내역 페이지에서 각각의 상품을 보여줄 박스
import React from "react";

const OrderItemDisplay = ({
  name,
  image,
  quantity,
  price,
  totalAmount,
  createdAt,
}) => {
  return (
    <div className="flex gap-2 justify-between items-center">
      <div>
        <img src={image} alt={name} />
      </div>
      <div className="flex flex-col gap-1 justify-between items-start">
        <p>{name}</p>
        <p>{price.toLocaleString("ko-kr")}원</p>
        <p>수량: {quantity}개</p>
      </div>
      <div className="flex flex-col gap-1 justify-between items-end">
        <p>{totalAmount.toLocaleString("ko-kr")}원</p>
        <p>구매일시: {createdAt}</p>
        {/* TODO: 환불로직 */}
        <button className="border rounded-lg p-2 bg-blue-500 hover:bg-amber-50 hover:text-black">
          환불하기
        </button>
      </div>
    </div>
  );
};

export default OrderItemDisplay;

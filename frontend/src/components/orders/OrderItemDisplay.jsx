//주문내역 페이지에서 각각의 상품을 보여줄 박스
import React from "react";

import { MdDelete } from "react-icons/md";
import { useUserStore } from "../../store/useUserStore";
import toast from "react-hot-toast";

const OrderItemDisplay = ({
  id,
  name,
  image,
  quantity,
  price,
  totalAmount,
  createdAt,
}) => {
  const { deleteOrderHistory } = useUserStore();

  const onDeleteBtnClick = async (id) => {
    try {
      await deleteOrderHistory(id);
      toast.success("삭제 성공!");
    } catch (error) {
      toast.error("다시 시도해주세요!");
    }
  };
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
        <button className="border rounded-lg p-2 bg-blue-500 hover:bg-amber-50 hover:text-black">
          환불하기
        </button>
        <MdDelete onClick={onDeleteBtnClick} />
      </div>
    </div>
  );
};

export default OrderItemDisplay;

//장바구니 담은 상품 모아보기 페이지에서 담은 수량을 변경할 경우 백엔드에 요청을 보내는 함수

import toast from "react-hot-toast";
import axiosInstance from "./axios";

//delta는 수량의 증감값을 의미
export const updateCartQuantity = async (id, delta) => {
  try {
    await axiosInstance.patch(`/api/v1/cart/${id}`, { quantity: delta });

    toast.success("수량을 변경했어요!");
  } catch (error) {
    toast.error("다시 시도해주세요");
    console.error(error);
  }
};

//장바구니 담은 상품 모아보기 페이지에서 담은 수량을 변경할 경우 백엔드에 요청을 보내는 함수

import toast from "react-hot-toast";
import axiosInstance from "./axios";

//장바구니 담은 수량 변경
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

//장바구니 담기 취소
export const deleteFromcart = async (productId) => {
  try {
    await axiosInstance.delete(`/api/v1/cart/${productId}`);
    toast.success("장바구니 담기를 취소했어요.");
  } catch (error) {
    toast.error("다시 시도해주세요.");
    console.error(error);
  }
};

//사장님 회원의 가게관리를 위한 API요청

import axiosInstance from "./axios";

//총 주문건수, 누적판매금 등 가게의 overview정보를 요청
export const getShopOverview = async () => {
  try {
    const response = await axiosInstance.get(`/api/v1/seller/overview`);
    return response.data.data;
  } catch (error) {
    console.error("가게 개요 정보를 불러오는 중 오류가 발생했습니다:", error);
    throw error;
  }
};

// 해당 가게에 등록된 모든 상품 정보를 요청
export const getProductsBySeller = async (sellerId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/products/${sellerId}`);
    console.log("axios응답데이터 구조:", response.data);
    return response.data.products;
  } catch (error) {
    console.error("가게 상품 정보를 불러오는 중 오류가 발생했습니다:", error);
    throw error;
  }
};

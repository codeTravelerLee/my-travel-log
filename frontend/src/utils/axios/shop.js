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
    console.log("가게 상품 정보:", response.data.products);

    return response.data.products;
  } catch (error) {
    console.error("가게 상품 정보를 불러오는 중 오류가 발생했습니다:", error);

    throw error;
  }
};

//가게에서 판매할 새 상품을 등록
export const addNewProduct = async (productData) => {
  try {
    const response = await axiosInstance.post(`/api/v1/seller`, {
      name: productData.name,
      price: productData.price,
      description: productData.description,
      category: productData.category,
      stock: productData.stock,
      image: productData.image,
    });
    return response.data.data;
  } catch (error) {
    console.error("새 상품 등록 중 오류가 발생했습니다:", error);
    throw error;
  }
};

//상품정보 수정
export const editProductInfo = async (productId, productData) => {
  try {
    const response = await axiosInstance.patch(`/api/v1/seller/${productId}`, {
      name: productData.name,
      price: productData.price,
      description: productData.description,
      category: productData.category,
      stock: productData.stock,
      image: productData.image,
    });
    return response.data.data;
  } catch (error) {
    console.error("상품 정보 수정 중 오류가 발생했습니다:", error);
    throw error;
  }
};

//상품정보 삭제
export const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/api/v1/seller/${productId}`);
    return response.data.message;
  } catch (error) {
    console.error("상품 삭제 중 오류가 발생했습니다:", error);
    throw error;
  }
};

//상품정보 수정을 위해 기존 상품 정보를 불러오도록 함
export const fetchOriginalProductData = async (productId) => {
  try {
    const response = await axiosInstance.get(`/api/v1/products/${productId}`);
    return response.data.product;
  } catch (error) {
    console.error("기존 상품 정보 불러오기 중 오류가 발생했습니다:", error);
    throw error;
  }
};

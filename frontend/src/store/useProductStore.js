// Product데이터의 전역상태관리를 위함 (zustand)

import { create } from "zustand";
import toast from "react-hot-toast";

import axiosInstance from "../utils/axios/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: "", //발생한 오류 메시지

  //상품 global state에서 products의 값을 설정
  setProducts: (products) => set({ products: products }),

  //모든 상품 정보를 불러옴
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/api/v1/products");
      const productsData = response.data.products;

      set({ products: productsData, loading: false });
    } catch (error) {
      set({ error: "모든 상품 불러오는 중 에러 발생!", loading: false });

      toast.error(
        error.response.data.error || "모든 상품 불러오는 중 에러 발생!"
      );
    }
  },

  //특정 가게에서 판매하는 모든 상품을 조회
  fetchAllProductsByShop: async (sellerId) => {
    set({ loading: true });

    try {
      const response = await axiosInstance.get(`/api/v1/products/${sellerId}`);
      const productsData = response.data.products;

      set({ products: productsData, loading: false });
    } catch (error) {
      set({ error: "가게의 모든 상품 불러오는 중 에러 발생!", loading: false });

      toast.error(
        error.response.data.error || "가게의 모든 상품 불러오는 중 에러 발생!"
      );
    }
  },
}));

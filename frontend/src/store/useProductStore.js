// Product데이터의 전역상태관리를 위함 (zustand)

import { create } from "zustand";
import toast from "react-hot-toast";

import axiosInstance from "../utils/axios/axios";

export const useProductStore = create((set) => ({
  products: [], //여러개의 상품을 찾은 경우
  loading: false,
  error: "", //발생한 오류 메시지
  totalCount: 0, //찾은 상품의 개수
  searchKeyword: "", //검색어
  sort: "newest", //상품 정렬 기준

  //setters
  setProducts: (products) => set({ products: products }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),

  //모든 상품 정보를 불러옴
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/api/v1/products");

      const productsData = response.data.products;
      const totalCount = response.data.totalCount;

      set({ products: productsData, totalCount: totalCount, loading: false });
    } catch (error) {
      set({ error: "모든 상품 불러오는 중 에러 발생!", loading: false });

      toast.error(
        error.response.data.error || "모든 상품 불러오는 중 에러 발생!"
      );
    }
  },

  //특정 id에 맞는 상품정보를 불러옴
  fetchProductById: async (id) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/api/v1/products/${id}`);

      set({ products: [response.data.product] });
    } catch (error) {
      console.error(error);
      set({ error: error.response.data.error });
    } finally {
      set({ loading: false });
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

  //검색
  searchProducts: async (keyword) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(`/api/v1/products/search`, {
        params: {
          keyword: keyword,
        },
      });

      const productsData = response.data.products;
      const totalCount = response.data.totalCount;

      set({ products: productsData, totalCount: totalCount });
    } catch (error) {
      console.error(error);
      set({ error: error });
    } finally {
      set({ loading: false });
    }
  },

  //정렬(검색결과에 대해 프론트에서 수행)
  setSort: (sortType) => {
    set((state) => {
      const sortedProducts = [...state.products]; // 복사

      switch (sortType) {
        case "price_asc":
          sortedProducts.sort((a, b) => a.price - b.price);
          break;

        case "price_desc":
          sortedProducts.sort((a, b) => b.price - a.price);
          break;

        case "newest":
          sortedProducts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          break;

        case "oldest":
          sortedProducts.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          break;
      }
      return { sort: sortType, products: sortedProducts };
    });
  },
}));

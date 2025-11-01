import { create } from "zustand";
import axiosInstance from "../utils/axios/axios";

export const useUserStore = create((set) => ({
  authUser: null, //현재 로그인한 유저 정보
  loading: false,
  error: "",
  cartItems: [], //현재 유저의 장바구니 상품들

  //setters
  setAuthUser: (user) => set({ authUser: user }),
  setCartItems: (items) => set({ cartItems: items }),

  //현재 로그인한 유저 정보 불러오기
  fetchAuthUser: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/api/auth/getCurrentUser");
      const userData = response.data;

      set({ authUser: userData });

      return userData;
    } catch (error) {
      console.error(error);
      set({ error: error.response.data.error });

      return null;
    } finally {
      set({ loading: false });
    }
  },
  //장바구니 담기
  addToCart: async (productId, quantity) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post(`/api/v1/cart/${productId}`, {
        quantity: quantity,
      });
      const addedProduct = response.data.cartItems;

      //장바구니 아이템 스토어에 반영
      set({ cartIems: addedProduct });

      toast.success(`${addedProduct.name}을 장바구니에 담았어요!`);
    } catch (error) {
      console.error(error.message);
      set({ error: error.response.data.error });
    } finally {
      set({ loading: false });
    }
  },
}));

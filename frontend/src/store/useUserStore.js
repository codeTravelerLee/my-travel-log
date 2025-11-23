import { create } from "zustand";
import axiosInstance from "../utils/axios/axios";
import toast from "react-hot-toast";

export const useUserStore = create((set) => ({
  authUser: null, //현재 로그인한 유저 정보
  loading: false,
  error: "",
  orders: [], //주문내역

  //setters
  setAuthUser: (user) => set({ authUser: user }),

  logIn: async (email, password) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_SERVER_URI}/api/auth/logIn`,
        { email, password }
      );

      const userData = response.data.user;

      set({ authUser: userData });

      return userData;
    } catch (error) {
      console.error(error);
      set({ error: error?.response?.data?.error || error });
    } finally {
      set({ loading: false });
    }
  },

  //현재 로그인한 유저 정보 불러오기
  fetchAuthUser: async () => {
    set({ loading: true });
    try {
      console.log("fetchAuthUser함수 호출됨");
      const response = await axiosInstance.get("/api/auth/getCurrentUser");
      const userData = response.data.userData;

      console.log("응답결과", response.data);

      set({ authUser: userData });

      return userData;
    } catch (error) {
      console.error(error);
      set({ error: error?.response?.data?.error });

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
      const addedProduct = response.data.addedProduct;

      console.log("장바구니에 담긴 상품:", addedProduct);

      toast.success(`${addedProduct.productName}을 장바구니에 담았어요!`);
    } catch (error) {
      console.error(error.message);
      set({ error: error?.response?.data?.error });
    } finally {
      set({ loading: false });
    }
  },

  //주문내역 불러오기
  fetchOrderHistory: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/api/v1/order/order-history");
      const orderHistoryData = response.data.orderData;

      set({ orders: orderHistoryData });

      return orderHistoryData;
    } catch (error) {
      console.error("주문내역 불러오는 도중 에러 발생:", error.message);
      set({ error: error?.response?.data?.error || error });
    } finally {
      set({ loading: false });
    }
  },
}));

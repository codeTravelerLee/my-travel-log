//결제 요청

import toast from "react-hot-toast";
import { stripePromise } from "../stripe/stripe";
import axiosInstance from "./axios";

export const payWithStripe = async (cartItems) => {
  try {
    const stripe = await stripePromise;

    const response = await axiosInstance.post(
      `/api/v1/payment/create-checkout-session`,
      {
        cartItems: cartItems,
        couponCode: null, //TODO: 쿠폰기능 추가시 여기에 쿠폰코드 전달
      }
    );

    //실제 결제 가능한 url로 리다이렉트
    window.location.href = response.data.url;
  } catch (error) {
    console.error(error);
  }
};

//stripe주문내역 저장
export const saveOrderAfterStripePayment = async (sessionId) => {
  try {
    const response = await axiosInstance.post(
      `/api/v1/payment/checkout-success-save-order`,
      {
        sessionId: sessionId,
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    if (error.response?.status === 400) {
      toast.error(error.response.data.error);
      window.location.href = "/";
    }
  }
};

//stripe주문내역 불러오기
export const getStripeOrderBySessionId = async (sessionId) => {
  try {
    const response = await axiosInstance.get(
      `/api/v1/order/stripe-order/${sessionId}`
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const payWithToss = async () => {};
export const payWithKakaoPay = async () => {};

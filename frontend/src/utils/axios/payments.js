//결제 요청

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

export const payWithToss = async () => {};
export const payWithKakaoPay = async () => {};

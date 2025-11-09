//결제 요청

import { useUserStore } from "../../store/useUserStore";
import { stripePromise } from "../stripe/stripe";
import axiosInstance from "./axios";

const { cartItems } = useUserStore();

export const payWithStripe = async () => {
  try {
    const stripe = await stripePromise;

    const response = await axiosInstance.post(
      `/api/v1/payment/create-checkout-session`,
      {
        cartItems: cartItems,
        couponCode: null, //TODO: 쿠폰기능 추가시 여기에 쿠폰코드 전달
      }
    );

    const sessionId = response.data.id;
    console.log("stripe결제 세션 생성됨:", sessionId);
  } catch (error) {
    console.error(error);
  }
};

export const payWithToss = async () => {};
export const payWithKakaoPay = async () => {};

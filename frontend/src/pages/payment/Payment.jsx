import React, { useEffect, useState } from "react";
import PaymentMethodButton from "../../components/payments/PaymentMethodButton";

import toast from "react-hot-toast";
import {
  payWithStripe,
  saveOrderAfterStripePayment,
} from "../../utils/axios/payments";
import { useUserStore } from "../../store/useUserStore";
import { useLocation } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";

const Payment = () => {
  const { authUser } = useUserStore();
  const { fetchProductById, products } = useProductStore();

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const productId = params.get("productId");

  useEffect(() => {
    if (productId) {
      fetchProductById(productId);
    }
  }, [productId, fetchProductById]);

  //버튼 누르면 각 결제수단으로 결제요청 보내기
  //productId가 있으면 개별상품 결제, 없으면 장바구니 담긴 상품 일괄결제
  const onPayBtnClick = async (payMethod) => {
    const itemsToPay = productId ? [products[0]] : authUser.cartItems;

    //결제수단 선택
    switch (payMethod) {
      case "Stripe":
        console.log("Stripe 결제 선택");
        console.log("장바구니에 담긴 상품 데이터:", itemsToPay);
        await payWithStripe(itemsToPay);

        break;

      case "Toss":
        //TODO: Toss 결제 요청 보내기
        break;

      case "Kakao Pay":
        //TODO: Kakao Pay 결제 요청 보내기
        break;

      default:
        toast.error("결제수단을 선택해주세요.");
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-1/2 w-full ">
      <p className="text-2xl font-bold pb-6">결제 수단을 선택해주세요.</p>
      {/* 결제수단 선택 버튼 */}
      <PaymentMethodButton
        name="Stripe"
        bgColor="#635BFF"
        fontColor={"white"}
        onClick={() => {
          console.log("버튼 클릭됨.");
          onPayBtnClick("Stripe");
        }}
      />
      <PaymentMethodButton
        name="Toss"
        bgColor="#0064FF"
        fontColor={"white"}
        onClick={() => {
          onPayBtnClick("Toss");
        }}
      />
      <PaymentMethodButton
        name="Kakao Pay"
        bgColor="#FFEB00"
        fontColor={"black"}
        onClick={() => {
          onPayBtnClick("Kakao Pay");
        }}
      />
    </div>
  );
};

export default Payment;

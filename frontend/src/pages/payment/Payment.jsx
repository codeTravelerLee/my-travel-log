import React, { useState } from "react";
import PaymentMethodButton from "../../components/payments/PaymentMethodButton";

import toast from "react-hot-toast";
import { payWithStripe } from "../../utils/axios/payments";

const Payment = () => {
  const [payMethod, setPayMethod] = useState(null);

  //버튼 누르면 각 결제수단으로 결제요청 보내기
  const onPayBtnClick = () => {
    switch (payMethod) {
      case "Stripe":
        console.log("Stripe 결제 선택");
        payWithStripe();
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
        onClick={() => setPayMethod("Stripe")}
      />
      <PaymentMethodButton
        name="Toss"
        bgColor="#0064FF"
        fontColor={"white"}
        onClick={() => setPayMethod("Toss")}
      />
      <PaymentMethodButton
        name="Kakao Pay"
        bgColor="#FFEB00"
        fontColor={"black"}
        onClick={() => setPayMethod("Toss")}
      />
    </div>
  );
};

export default Payment;

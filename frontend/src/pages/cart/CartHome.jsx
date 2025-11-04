//장바구니 담은 상품을 모아서 보여주는 페이지

import React, { useEffect } from "react";
import CartItemDisplay from "../../components/carts/CartItemDisplay";
import { useUserStore } from "../../store/useUserStore";
import { useLocation, useNavigate } from "react-router-dom";

const CartHome = () => {
  const { fetchAuthUser, authUser, error, loading } = useUserStore();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadUserData = async () => {
      await fetchAuthUser();
      console.log("authUser in CartHome:", authUser);
    };

    loadUserData();
  }, [fetchAuthUser, authUser?._id, location.pathname]);

  if (error)
    return (
      <div className="flex flex-col items-center justify-center text-5xl font-bold">
        문제가 발생했어요. 다시 시도해주세요.
      </div>
    );

  return loading ? (
    <div className="flex flex-col items-center justify-center text-5xl font-bold">
      데이터를 불러오고 있어요. 조금만 기다려주세요!
    </div>
  ) : (
    <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
      {authUser?.cartItems?.map((item) => (
        <CartItemDisplay
          key={item._id}
          image={item.image}
          name={item.productName}
          price={item.price}
          quantity={item.quantity}
        />
      ))}
      <button
        className="w-full rounded-lg m-4 p-4 bg-blue-500 font-white text-bold text-center text-lg"
        onClick={() => {
          navigate("/payment");
        }}
      >
        결제하기
      </button>
    </div>
  );
};

export default CartHome;

import React, { useState } from "react";

import { useUserStore } from "../../store/useUserStore";
import LoadingSpinner from "../commons/LoadingSpinner";

import toast from "react-hot-toast";
import { TiPlus, TiMinus } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import CartItemDisplay from "./CartItemDisplay";

const CartModal = ({ isOpen, onClose, products }) => {
  //장바구니 담을 상품의 수량
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const { fetchAuthUser, addToCart, loading, error, authUser } = useUserStore();

  //장바구니 담기 누르면
  const onAddToCart = async () => {
    if (confirm("장바구니를 담으시겠습니까?")) {
      try {
        const user = await fetchAuthUser();

        //로그인되지 않은 경우
        if (!user) {
          toast.error("먼저 로그인을 해주세요");
          navigate("/logIn");
        }

        //로그인된 유저라면
        await addToCart(products[0]._id, quantity);

        navigate(`/carts/${authUser._id}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // 에러 발생시
  if (error)
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <p className="font-bold text-5xl">
          문제가 발생했어요. 다시 시도해주세요.
        </p>
      </div>
    );

  return (
    <>
      {/* 오버레이 (배경) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* 바텀시트 모달 */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "50vh" }}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-black">장바구니 담기</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <CartItemDisplay
            image={products[0].image}
            name={products[0].name}
            price={products[0].price}
            quantity={quantity}
          />

          <p className="text-red-600 font-bold p-4">
            총 가격: {(products[0].price * quantity).toLocaleString("ko-Kr")}원
          </p>

          <div className="absolute bottom-4 left-0 w-full px-4">
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-lg"
              onClick={onAddToCart}
            >
              {loading ? <LoadingSpinner size="sm" /> : "장바구니에 추가"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartModal;

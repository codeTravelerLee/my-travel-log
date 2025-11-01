import React, { useState } from "react";

import { useUserStore } from "../../store/useUserStore";

import toast from "react-hot-toast";
import { TiPlus, TiMinus } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const CartModal = ({ isOpen, onClose, products }) => {
  //장바구니 담을 상품의 수량
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const { fetchAuthUser, addToCart, setAuthUser, authUser, loading } =
    useUserStore();

  //장바구니 담기 누르면
  const onAddToCart = async () => {
    if (confirm("장바구니를 담으시겠습니까?")) {
      try {
        await fetchAuthUser();

        //로그인되지 않은 경우 
        if (!authUser) {
          toast.error("먼저 로그인을 해주세요");
          navigate("/logIn");
        }

        //로그인된 유저라면
        await addToCart(products[0]._id, quantity);
      } catch (error) {
        console.error(error);
      }
    }
  };

  //TODO: 로딩, 에러시 UI처리

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

          <div className="flex gap-2 mt-6 text-black bg-gray-200 rounded-md p-4">
            <img src={products[0].image} alt={"img"} className="w-24" />
            <div>
              <p>{products[0].name}</p>
              <p className="text-red-600 font-bold">
                {products[0].price.toLocaleString("ko-Kr")}원{" "}
              </p>
              <div className="flex gap-1 pt-2">
                <p>수량: {quantity}</p>
                <button
                  className="border rounded-sm p-1"
                  onClick={() => {
                    setQuantity((prev) => prev + 1);
                  }}
                >
                  <TiPlus />
                </button>
                <button
                  className="border rounded-sm p-1"
                  onClick={() => {
                    if (quantity === 1) {
                      toast.error("최소 수량은 1개입니다.");
                      return;
                    }
                    setQuantity((prev) => prev - 1);
                  }}
                >
                  <TiMinus />
                </button>
              </div>
            </div>
          </div>

          <p className="text-red-600 font-bold p-4">
            총 가격: {(products[0].price * quantity).toLocaleString("ko-Kr")}원
          </p>

          <div className="absolute bottom-4 left-0 w-full px-4">
            <button
              className="w-full bg-blue-500 text-white py-3 rounded-lg"
              onClick={onAddToCart}
            >
              장바구니에 추가
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartModal;

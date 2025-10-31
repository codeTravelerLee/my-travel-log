import React from "react";

const CartModal = ({ isOpen, onClose }) => {
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
            <h2 className="text-xl font-semibold">장바구니 담기</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div className="mt-6">
            <p>상품 옵션 / 수량 선택 등의 내용이 들어갈 자리입니다.</p>
          </div>

          <div className="absolute bottom-4 left-0 w-full px-4">
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg">
              장바구니에 추가
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartModal;

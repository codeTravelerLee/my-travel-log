//개별 상품 각각을 표시하는 컴포넌트

import React from "react";

const ProductItem = ({ name, price, image, category }) => {
  return (
    <div
      className="flex flex-col items-center border rounded-2xl 
                 shadow-sm bg-white p-3 cursor-pointer
                 transition-transform duration-300 ease-in-out 
                 hover:scale-105 hover:shadow-lg"
    >
      <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100">
        <img
          src={image}
          alt="상품 이미지 준비중"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1 mt-2 text-left w-full">
        <span className="text-sm text-gray-400">{category}</span>
        <span className="text-base font-semibold text-gray-900">{name}</span>
        <span className="text-lg font-bold text-red-600">
          {price?.toLocaleString("ko-KR")} 원
        </span>
      </div>
    </div>
  );
};

export default ProductItem;

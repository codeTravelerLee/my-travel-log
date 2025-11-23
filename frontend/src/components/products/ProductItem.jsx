//개별 상품 각각을 표시하는 컴포넌트

import React from "react";
import { Link } from "react-router-dom";

const ProductItem = ({ name, price, image, category, stock, id }) => {
  return (
    <Link to={`/product/${id}`}>
      <div
        className="flex flex-col items-center border rounded-2xl 
                 shadow-sm bg-white p-2 cursor-pointer
                 transition-transform duration-300 ease-in-out 
                 hover:scale-105 hover:shadow-lg h-full w-full"
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
          <div className="flex gap-2 justify-between items-center">
            <span className="text-lg font-bold text-red-600">
              {price?.toLocaleString("ko-KR")} 원
            </span>
            {/* 재고에 따른 구매가능여부 표시 */}
            {stock === 0 && (
              <span className="w-fit ml-auto  text-center text-base font-bold bg-red-600 text-white  p-2 rounded-lg">
                품절
              </span>
            )}
            {stock && stock !== 0 && (
              <span className="w-fit  ml-auto text-center text-base font-bold bg-green-600 text-black  p-2 rounded-lg">
                {stock}개 남음
              </span>
            )}
            {stock === null ||
              (stock === undefined && (
                <span className="w-fit  ml-auto text-center text-base font-bold bg-blue-600 text-black  p-2 rounded-lg">
                  구매가능
                </span>
              ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;

//개별 상품의 상세페이지
//TODO: 결제창 구현
//TODO: 장바구니 담기 구현

import React from "react";
import { Link, useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams(); //상품id
  return (
    <div className="flex flex-col items-center h-full w-full ">
      {/* 스크롤 되는 영역 */}
      <div className="flex flex-col items-center">
        <div>
          <p>카테고리</p>
        </div>
        <div>
          <p>상품 이름</p>
        </div>
        <div>
          <img
            src={""}
            alt="상품 이미지"
            className="w-full aspect-square overflow-hidden rounded-lg"
          />
        </div>
        {/* 판매자 정보 */}
        <Link to={""}>
          <div className="flex flex-row gap-1.5 justify-start items-center">
            <img
              src=""
              alt=""
              className="aspect-square overflow-hidden rounded-full"
            />
            <p>판매자 이름</p>
          </div>
        </Link>
        <div>상품정보</div>
        <button>더보기</button>
      </div>

      {/* 고정된 영역 -> 하단 중앙 정렬 */}
      <div className="w-full absolute bottom-0 left-1/2 -translate-x-1/2  flex flex-row gap-4 justify-between items-center bg-white text-black p-8 rounded-lg m-8">
        <div>
          <p className="text-red-600">34,000원</p>
        </div>
        <div className="flex flex-row gap-2 justify-center items-center">
          <button className="border rounded-lg p-2">장바구니 담기</button>
          <button className="border rounded-lg p-2">결제</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

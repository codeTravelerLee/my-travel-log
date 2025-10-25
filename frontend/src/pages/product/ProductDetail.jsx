//개별 상품의 상세페이지
//TODO: 결제창 구현
//TODO: 장바구니 담기 구현

import React from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams(); //상품id
  return <div>{id} 의 상품 상제정보 페이지</div>;
};

export default ProductDetail;

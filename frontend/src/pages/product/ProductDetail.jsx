//개별 상품의 상세페이지
//TODO: 결제창 구현
//TODO: 장바구니 담기 구현

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";

import LoadingSpinner from "../../components/commons/LoadingSpinner";
import avatarPlaceholder from "../../assets/profile/avatar-placeholder.png";
import CartModal from "../../components/carts/CartModal";

const ProductDetail = () => {
  const { id } = useParams(); //상품id
  const { fetchProductById, products, loading, error } = useProductStore();

  const navigate = useNavigate();

  //장바구니 모달창
  const [isCartOpen, setIsCartOpen] = useState(false);

  //특정 id에 맞는 상품정보를 불러옴
  useEffect(() => {
    fetchProductById(id);
  }, [fetchProductById, id]);

  //dev
  console.log("products", products);

  //결제버튼 클릭시
  const handlePayBtnClick = () => {
    navigate(`/payment?productId=${products[0]._id}`);
  };

  //에러 발생시
  if (error)
    return (
      <div className="flex items-center justify-center text-6xl">
        문제가 발생했어요. 다시 시도해주세요.
      </div>
    );

  if (loading) return <LoadingSpinner size={"lg"} />;

  return (
    <div className="flex flex-col flex-1  w-full ">
      {/* 스크롤 되는 영역 */}
      <div className="flex flex-col flex-1 overflow-auto gap-1 items-start  h-full m-4">
        <p className="text-gray-500">{products[0].category}</p>
        <p className="text-3xl font-bold mb-5">{products[0].name}</p>

        <img
          src={products[0].image}
          alt={products[0].name || "상품 이미지"}
          className="w-full rounded-lg mb-4"
        />

        {/* 판매자 정보 */}
        <p className="text-gray-300 font-bold">판매자</p>
        <Link to={`/shop/${id}`}>
          <div className="flex flex-row gap-3 justify-start items-center mb-7 bg-gray-700 w-full min-h-20 rounded-lg p-4">
            <img
              src={products[0].seller.profileImg || avatarPlaceholder}
              alt={products[0].seller.userName || "판매자 프로필"}
              className="w-16 aspect-square overflow-hidden rounded-full"
            />
            <p>{products[0].seller.userName}</p>
          </div>
        </Link>
        <p className="text-gray-300 font-bold">상품 정보</p>
        <div className="bg-gray-700 w-full min-h-20 rounded-lg p-4">
          {products[0].description}
        </div>
        <button>더보기</button>
      </div>

      {/* 고정된 영역 -> 하단 중앙 정렬 */}
      <div className=" left-0 flex justify-between items-center bg-white text-black p-4 md:p-6 rounded-t-lg shadow-inner w-full">
        <div>
          <p className="text-red-600 font-bold text-xl">
            {products[0].price.toLocaleString("ko-KR")}원
          </p>
        </div>
        <div className="flex flex-row gap-2 justify-center items-center hover:cursor-pointer">
          <button
            onClick={() => setIsCartOpen(true)}
            className="border rounded-lg p-2 font-bold  hover:bg-black hover:text-white"
          >
            장바구니 담기
          </button>
          <button
            className="border rounded-lg p-2 font-bold hover:bg-black hover:text-white"
            onClick={handlePayBtnClick}
            disabled={products[0].stock === 0}
          >
            {products[0].stock === 0 ? "품절" : "결제"}
          </button>
        </div>
      </div>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        products={products}
      />
    </div>
  );
};

export default ProductDetail;

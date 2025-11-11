//장바구니 담은 상품을 모아서 보여주는 페이지

import { useEffect, useState } from "react";
import CartItemDisplay from "../../components/carts/CartItemDisplay";
import { useUserStore } from "../../store/useUserStore";
import { Link, useNavigate } from "react-router-dom";
import { updateCartQuantity } from "../../utils/axios/carts";
import TotalPriceView from "../../components/payments/TotalPriceView";

const CartHome = () => {
  const { authUser, error, loading } = useUserStore();
  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (authUser?.cartItems) {
      setCartItems(authUser.cartItems);
    }
  }, [authUser]);

  if (error)
    return (
      <div className="flex flex-col items-center justify-center text-5xl font-bold">
        문제가 발생했어요. 다시 시도해주세요.
      </div>
    );

  //자식 컴포넌트인 CartItemDisplay에 전달할 수량변경 함수
  const handleIncrease = async (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    //axios로 백엔드에 수량 변경 요청 보내기
    await updateCartQuantity(productId, 1);
  };

  const handleDecrease = async (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    //axios로 백엔드에 수량 변경 요청 보내기
    await updateCartQuantity(productId, -1);
  };

  return loading ? (
    <div className="flex flex-col items-center justify-center text-5xl font-bold">
      데이터를 불러오고 있어요. 조금만 기다려주세요!
    </div>
  ) : (
    <div className="flex flex-col gap-2 w-full h-full items-center justify-center p-4">
      <div className="flex gap-7 justify-between items-center w-full h-full">
        <div className="flex flex-col gap-0.5">
          {cartItems.map((item) => (
            <CartItemDisplay
              key={item._id}
              image={item.image}
              name={item.productName}
              price={item.price}
              quantity={item.quantity}
              onIncreaseQuantity={() => handleIncrease(item.productId)}
              onDecreaseQuantity={() => handleDecrease(item.productId)}
            />
          ))}
        </div>
        {/* 총 가격을 표시 */}
        <TotalPriceView cartItems={cartItems} />
      </div>

      <Link to={"/products"}>더 많은 상품 담기</Link>
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

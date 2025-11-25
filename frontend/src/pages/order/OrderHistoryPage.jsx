//사용자의 주문내역을 목록 형태로 보여주는 페이지

import React, { useEffect, useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import OrderItemDisplay from "../../components/orders/OrderItemDisplay";

const OrderHistoryPage = () => {
  const fetchOrderHistory = useUserStore((state) => state.fetchOrderHistory);
  const orders = useUserStore((state) => state.orders);

  //결제내역을 불러옴
  //FIXME:  orders가 빈 배열임, 무한로딩 뜸
  useEffect(() => {
    const fetchOrder = async () => {
      await fetchOrderHistory();
      console.log("결제내역을 불러오고 있어요.");
    };
    fetchOrder();
    console.log("orders array:", orders);
  }, []);

  return (
    //결제내역을 카드 형태로 display.
    <div>
      <div>
        {orders.length === 0 && (
          <p className="flex justify-center items-center text-2xl text-center font-bold">
            주문내역이 없습니다.
          </p>
        )}
        {orders.map((order) =>
          order.cartItems?.map((item, idx) => (
            <OrderItemDisplay
              key={idx}
              name={item.name}
              image={item.image}
              quantity={item.quantity}
              price={item.price}
              totalAmount={order.totalAmount}
              createdAt={order.createdAt}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;

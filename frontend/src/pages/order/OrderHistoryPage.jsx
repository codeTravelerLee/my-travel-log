//사용자의 주문내역을 목록 형태로 보여주는 페이지

import React, { useEffect, useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import OrderItemDisplay from "../../components/orders/OrderItemDisplay";
import { useShallow } from "zustand/react/shallow";

const OrderHistoryPage = () => {
  const { fetchOrderHistory, orders } = useUserStore(
    useShallow((state) => ({
      fetchOrderHistory: state.fetchOrderHistory,
      orders: state.orders,
    }))
  );

  //결제내역을 불러옴
  useEffect(() => {
    fetchOrderHistory();
  }, []);

  useEffect(() => {
    console.log("orders array:", orders);
  }, [orders]);

  return (
    //결제내역을 카드 형태로 display.
    <div>
      <div className="h-full">
        {orders?.length === 0 && (
          <p className="flex justify-center items-center text-2xl text-center font-bold">
            주문내역이 없습니다.
          </p>
        )}
        {orders.map((order) =>
          order.cartItems?.map((item, idx) => (
            <OrderItemDisplay
              id={order._id}
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

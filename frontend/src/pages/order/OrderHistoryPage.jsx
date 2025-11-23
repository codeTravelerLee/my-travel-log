//사용자의 주문내역을 목록 형태로 보여주는 페이지

import React, { useEffect, useState } from "react";
import { useUserStore } from "../../store/useUserStore";
import OrderItemDisplay from "../../components/orders/OrderItemDisplay";

const OrderHistoryPage = () => {
  const { fetchOrderHistory, loading, error, authUser } = useUserStore();

  //zustand로 받아온 데이터를 local-state로 받아옴
  const [orderHistoryDataArray, setOrderHistoryDataArray] = useState([]);

  //결제내역을 불러옴
  useEffect(() => {
    const fetchOrder = async () => {
      await fetchOrderHistory();
    };

    const orders = fetchOrder();
    setOrderHistoryDataArray(orders);
  }, [fetchOrderHistory, authUser]);

  return (
    //결제내역을 카드 형태로 display.
    //FIXME: 각각의 결제 안에는 여러 상품이 있을 수 있음. 고로 배열을 다루도록 변경 필요
    <div>
      {orderHistoryDataArray.map((order, idx) => (
        <OrderItemDisplay
          key={idx}
          name={order.cartItems.name}
          image={order.cartItems.image}
          quantity={order.quantity}
          price={order.cartItems.price}
          totalAmount={order.totalAmount}
          createdAt={order.createdAt}
        />
      ))}
    </div>
  );
};

export default OrderHistoryPage;

import React from "react";
import toast from "react-hot-toast";
import { TiPlus, TiMinus } from "react-icons/ti";

const CartItemDisplay = ({
  image,
  name,
  price,
  quantity,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) => {
  return (
    <div>
      <div className="flex gap-2 mt-6 text-black bg-gray-200 rounded-md p-4">
        <img src={image} alt={"img"} className="w-24" />
        <div>
          <p>{name}</p>
          <p className="text-red-600 font-bold">
            {price.toLocaleString("ko-Kr")}원
          </p>
          <div className="flex gap-1 pt-2">
            <p>수량: {quantity}</p>
            <button
              className="border rounded-sm p-1"
              onClick={onIncreaseQuantity}
            >
              <TiPlus />
            </button>
            <button
              className="border rounded-sm p-1"
              onClick={onDecreaseQuantity}
            >
              <TiMinus />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemDisplay;

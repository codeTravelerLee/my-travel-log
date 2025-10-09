// 장바구니 담기와 관련된 APIs

import Product from "../models/product.model.js";

//장바구니 담기
export const addToCart = async (req, res) => {
  try {
    const { id: productId } = req.params; // 담을 상품의 id

    //담을 상품 객체
    const product = await Product.findById(productId);

    //해당 상품이 존재하지 않을 경우
    if (!product)
      return res.status(404).json({ error: "해당 상품은 존재하지 않습니다." });

    //상품 존재 -> 장바구니 담기
    //현재사용자
    const currentUser = req.user;

    //이미 담겨있다면 수량증가, 없다면 user model의 cartItems에 추가
    // existingCartItem에는 조건을 만족하는 cartItem객체가 담김
    const existingCartItem = await currentUser.cartItems.find(
      (item) => item.productId === productId
    );

    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      await currentUser.cartItems.push({ productId: productId });
    }

    //cartItems수정사항 반영
    await currentUser.save();

    res.status(200).json({
      message: `${product.name}을 장바구니에 담았어요!`,
      data: product,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "internal server error, progress: addToCart" });
  }
};

//장바구니 담기 취소
export const removeFromCart = async (req, res) => {};

//장바구니 담은 수량 변경
export const changeCartQuantity = async (req, res) => {};

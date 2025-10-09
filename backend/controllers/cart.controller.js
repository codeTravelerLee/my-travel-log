// 장바구니 담기와 관련된 APIs

import Product from "../models/product.model.js";
import User from "../models/user.model.js";

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
    const currentUser = await User.findById(req.user._id).select("-password");

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
    console.error(error.message);

    res
      .status(500)
      .json({ error: "internal server error, progress: addToCart" });
  }
};

//장바구니 담기 취소
export const removeFromCart = async (req, res) => {
  try {
    const { id: productId } = req.params; //삭제할 상품의 id
    const currentUser = await User.findById(req.user._id).select("-password");

    //장바구니 담기가 되어있으면 취소, 안되어있으면 에러주기
    const isItemInCart = currentUser.cartItems.some(
      (item) => item.productId.toString() === productId
    );

    if (isItemInCart) {
      const newCartItems = currentUser.cartItems.filter(
        (item) => item.productId.toString() !== productId.toString()
      );

      currentUser.cartItems = newCartItems;
      await currentUser.save();
    } else {
      return res
        .status(404)
        .json({ error: "장바구니에 담겨있지 않은 상품입니다. " });
    }

    res.status(200).json({ message: "상품을 장바구니에서 뺐어요." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "internal server error. progress: removeFromCart" });
  }
};

//장바구니 담은 수량 변경
export const changeCartQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; //수량을 변경할 상품id
    const currentUser = await User.findById(req.user._id).select("-password");
    const { quantity } = req.body; //변경할 수량

    //변경할 수량이 0이면 에러처리
    if (quantity === 0) {
      return res
        .status(422)
        .json({ error: "변경할 수량은 0이 아니어야 합니다." });
    }

    //정상적인 수량변경 요청이 온 경우
    const cartItem = currentUser.cartItems?.find(
      (item) => item.productId.toString() === productId.toString()
    );

    cartItem.quantity += quantity;

    //수량변경후 해당 상품의 수량이 0이면 장바구니 담은 항목에서 제거
    if (cartItem.quantity === 0) {
      const newCartItems = currentUser.cartItems.filter(
        (item) => item.productId.toString() !== productId.toString()
      );

      currentUser.cartItems = newCartItems;
    }

    //변동사항 DB반영
    await currentUser.save();

    res.status(200).json({ message: "수량 변경 성공!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "internal server error. progress: changeCartQuantity" });
  }
};

//장바구니 담은 상품목록 가져오기
export const getCartItems = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const currentUser = await User.findById(currentUserId)
      .select("-password")
      .populate({ path: "cartItems.productId" });

    const cartItems = currentUser.cartItems;

    return res.status(200).json({
      message: `${currentUser.userName}님의 장바구니 담은 상품 목록을 가져왔어요.`,
      data: cartItems,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "internal server error. progress: getCartItems" });
  }
};

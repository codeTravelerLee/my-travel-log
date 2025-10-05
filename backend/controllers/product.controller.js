// 여행상품 거래 페이지를 위한 APIs

import Product from "../models/product.model.js";

//모든 상품을 조회
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res
      .status(200)
      .json({ products: products, message: "모든 상품을 가져왔어요" });
  } catch (error) {
    res.status(500).json({ error: `internal server error...${error.message}` });
  }
};

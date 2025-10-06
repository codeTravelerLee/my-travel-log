// 여행상품 거래 페이지를 위한 APIs

import Product from "../models/product.model.js";
import redis from "ioredis";

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

//즐겨찾기한 상품을 조회
export const getFeaturedProducts = async (req, res) => {
  try {
    //먼저 레디스에 있는지 확인하고, 없으면 mongoDB에서 가져올 것(재할당이 일어나므로 let)
    let featuredProducts = await redis.get(`featured_products_${req.user._id}`);

    //Redis에 해당 내용이 존재하는 경우
    if (featuredProducts) {
      return res.status(200).json({
        message: "redis에서 즐겨찾기한 상품을 찾아왔습니다",
        data: JSON.parse(featuredProducts), //Redis는 데이터를 string으로 저장하기에, 클라이언트로 보낼 경우 json으로 형태를 바꿔줌
      });
    }

    //Redis에 없는 경우 mongoDB에서 찾아봄
    featuredProducts = await Product.find({ isFeatured: true });

    //몽고디비에도 없는 경우
    //prettier-ignore
    if(!featuredProducts) return res.status(404).json({error: "해당 상품은 존재하지 않습니다."});

    //몽고디비에 존재하는 경우 나중의 빠른 접근을 위해 Redis에 저장
    // redis에 저장할 땐, 문자열 형태로 변환하여 저장해야함.
    await redis.set(
      `featured_products_${req.user._id}`,
      JSON.stringify(featuredProducts)
    );

    res.status(200).json({
      message: "즐겨찾기한 상품을 가져왔어요",
      data: featuredProducts,
    });
  } catch (error) {}
};

// 판매할 상품을 등록 (sellerRoute를 거침)
export const createProduct = async (req, res) => {};

// 여행상품 거래 페이지를 위한 APIs

import Product from "../models/product.model.js";
import redis from "../lib/db/redis.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import logger from "../../logger.js";

//모든 상품을 조회
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const totalCount = products.length;

    res.status(200).json({
      products: products,
      totalCount: totalCount,
      message: "모든 상품을 가져왔어요",
    });
  } catch (error) {
    res.status(500).json({ error: `internal server error...${error.message}` });
  }
};

//특정 id에 맞는 상품 조회
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate({
      path: "seller",
      select: "userName profileImg",
    });

    res
      .status(200)
      .json({ message: "상품 정보 불러오기 성공", product: product });
  } catch (error) {
    res.status(500).json({ error: `internal server error...${error.message}` });
  }
};

//상품 검색
export const searchProducts = async (req, res) => {
  try {
    const { keyword = "" } = req.query;

    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    const totalCount = products.length;

    res.status(200).json({
      message: "상품 검색 성공!",
      products: products,
      totalCount: totalCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "상품검색중 오류 발생." });
  }
};

//가게별로 사장님이 주력으로 등록한 상품을 조회
export const getFeaturedProducts = async (req, res) => {
  try {
    //프론트에서, 각 사장님 전용 몰에 들어가면, url에 sellerId가 있을 것. -> sellerId는 각 쇼핑몰의 구분자
    const sellerId = req.params.sellerId;

    //먼저 레디스에 있는지 확인하고, 없으면 mongoDB에서 가져올 것(재할당이 일어나므로 let)
    let featuredProducts = await redis.get(`featured_products_${sellerId}`);

    //Redis에 해당 내용이 존재하는 경우
    if (featuredProducts) {
      return res.status(200).json({
        message: "redis에서 주력상품을 찾아왔습니다",
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
      `featured_products_${sellerId}`,
      JSON.stringify(featuredProducts)
    );

    res.status(200).json({
      message: "사장님이 주력으로 등록하신 상품을 가져왔어요",
      data: featuredProducts,
    });
  } catch (error) {
    console.log(
      `가게의 주력상품을 불러오는 과정에서 에러가 발생했어요.: ${error.message}`
    );
    res.status(500).json({ error: "intetnal server error" });
  }
};

//카테고리별 상품 조회
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category: category });

    res.status(200).json({
      message: `${category} 카테고리 상품들을 모두 불러왔어요!`,
      data: products,
    });
  } catch (error) {
    console.log(
      `카테고리에 맞는 상품을 불러오는 과정에서 에러가 발생했어요.: ${error.message}`
    );
    res.status(500).json({ error: "intetnal server error" });
  }
};

// 가게별 전체상품 조회
export const getProductsBySeller = async (req, res) => {
  try {
    const { id } = req.params; //조회할 가게(사장님)의 _id
    const sellerId = new mongoose.Types.ObjectId(id);

    logger.info("요청된 sellerId의 타입:", typeof sellerId);
    console.log("요청된 sellerId:", sellerId);

    //사장님으로 등록되지 않은 사용자인지 체크
    const userRole = await User.findById(sellerId).select("role");

    // console.log(userRole);
    if (userRole.role !== "seller") {
      return res
        .status(403)
        .json({ message: "이 사용자는 상품 판매자가 아닙니다!" });
    }

    // 유효성 검사: sellerId가 유효한 ObjectId 형식인지 확인
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      console.log(`[Validation Error] 유효하지 않은 sellerId: ${sellerId}`);
      return res
        .status(400)
        .json({ message: "요청된 판매자 ID 형식이 유효하지 않습니다." });
    }

    //사장님으로 등록된 경우
    //사장님으로 등록됐으나 등록한 상품이 없는 경우는 빈 배열 반환
    const products = await Product.find({ seller: sellerId });

    const productsData = products ?? [];

    //FIXME: products가 계속 null임...
    console.log("db탐색결과 products: ", products);
    console.log("반환된 products data: ", productsData);

    res.status(200).json({
      message: "해당 가게의 상품들을 불러왔어요.",
      products: productsData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "internal server error. progress: getProductsBySeller" });
  }
};

// 여행상품 거래 페이지를 위한 APIs

import Product from "../models/product.model.js";
import redis from "ioredis";
import { v2 as cloudinary } from "cloudinary";

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

// 판매할 상품을 등록 (sellerRoute를 거침)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, isFeatured } = req.body;
    let { image } = req.body;

    //필수속성들이 다 있는지 체크
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ error: "모든 정보를 입력해주세요" });
    }

    //이미지의 경우 cloudinary스토리지에 저장
    //스토리지에 접근 가능한 문자열만 mongoDB에 저장.
    const cloudinaryResponse = await cloudinary.uploader.upload(image, {
      folder: "products",
    });
    image = cloudinaryResponse.secure_url;

    //mongoDB에 저장할 새로운 상품 객체
    const newProduct = {
      name: name,
      description: description,
      price: price,
      image: image,
      category: category,
      isFeatured: isFeatured,
      seller: req.user._id, //판매자 -> 현재 사장님 회원의 id(해당 컨트롤러는 sellerRoute를 거치므로)
    };

    await Product.create(newProduct);

    res.status(200).json({ message: "상품 등록 성공!", data: newProduct });
  } catch (error) {
    console.log(`상품 등록 과정에서 에러가 발생했어요.: ${error.message}`);
    res.status(500).json({ error: "intetnal server error" });
  }
};

// id로 상품 하나 삭제(sellerRoute를 거침)
export const deleteProductById = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const currentUserId = req.user._id; //해당 컨트롤러는 sellerRoute를 거치므로, currentUserId는 곧 사장님의 id

    //삭제하고자 하는 상품 객체
    const product = await Product.findById(productId);

    //해당 상품이 존재하지 않는 경우
    if (!product) return res.sendStatus(404);

    //본인이 등록한 상품인 경우에만 삭제 가능
    if (product.seller.toString() !== currentUserId.toString()) {
      return res.status(403).json({ error: "자신의 상품만 삭제 가능합니다." });
    }

    //본인의 상품이 맞는 경우
    //주력 상품으로 등록되어 있다면 Redis에도 저장되어 있을 것이므로, redis에서도 해당 데이터를 삭제
    if (product.isFeatured) {
      await redis.del(`featured_products_${currentUserId}`);
    }

    //cloudinary에 저장된 상품사진 삭제
    //product폴더 내 사진별 id로 삭제
    await cloudinary.uploader.destroy(
      `products/${product.image.split("/").pop().split(".")[0]}`
    );

    //몽고 디비에서도 지워줌
    await Product.findByIdAndDelete(productId);

    res.status(200).json({ message: "상품 삭제 완료!" });
  } catch (error) {
    console.log(
      `등록된 상품을 삭제하는 과정에서 에러가 발생했어요.: ${error.message}`
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

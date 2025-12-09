//각 가게의 사장님(seller role을 가진) 회원의 가게관리 페이지 APIs

import mongoose from "mongoose";

import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

import { v2 as cloudinary } from "cloudinary";
import redis from "../lib/db/redis.js";
import logger from "../../logger.js";

//해당 가게의 overview정보제공
export const getShopOverview = async (req, res) => {
  try {
    const shopId = new mongoose.Types.ObjectId(req.user._id);

    //가게 내 등록된 상품의 수
    const shopProductCount = await Product.countDocuments({
      seller: shopId,
    });

    //가게에서 결제된 주문건수, 주문총액 데이터
    const shopOrderData = await Order.aggregate([
      // cartItems 배열을 펼침
      { $unwind: "$cartItems" },

      // Product 컬렉션과 조인
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" },

      // 현재 shopId의 상품만 필터링
      {
        $match: {
          "productInfo.seller": shopId,
        },
      },

      // 주문 수와 매출 합계 계산
      {
        $group: {
          _id: null,
          shopOrderCount: { $sum: 1 }, // 해당 가게 상품이 포함된 주문 아이템 수
          shopTotalRevenue: {
            $sum: { $multiply: ["$cartItems.price", "$cartItems.quantity"] },
          },
        },
      },
    ]);

    const { shopOrderCount = 0, shopTotalRevenue = 0 } = shopOrderData[0] || {};

    //가게 정보 데이터를 취합
    const shopOverviewData = {
      shopProductCount,
      shopOrderCount,
      shopTotalRevenue,
    };

    res
      .status(200)
      .json({ message: "가게 정보 불러오기 성공!", data: shopOverviewData });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

// 판매할 상품을 등록 (sellerRoute를 거침)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, isFeatured, stock } = req.body;
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
      stock: stock,
      isFeatured: isFeatured,
      seller: req.user._id, //판매자 -> 현재 사장님 회원의 id(해당 컨트롤러는 sellerRoute를 거치므로)
    };

    await Product.create(newProduct);

    res.status(200).json({ message: "상품 등록 성공!", data: newProduct });
  } catch (error) {
    console.log(`상품 등록 과정에서 에러가 발생했어요.: ${error.message}`);
    logger.error(`상품 등록 과정에서 에러가 발생했어요.: ${error.message}`);
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

//주력 상품으로 등록하기
export const featureProduct = async (req, res) => {
  try {
    const { id: productId } = req.params; //주력상품으로 등록할 상품의 아이디

    const featuredProduct = await Product.findByIdAndUpdate(
      productId,
      { isFeatured: true },
      { new: true } //수정된 객체를 반환
    );

    //해당 상품이 없다면
    if (!featuredProduct) return res.sendStatus(404);

    //상품이 존재하면 주력상품은 redis에 저장
    await redis.set(
      `featured_products_${req.user._id}`,
      JSON.stringify(featuredProduct)
    );

    res.status(200).json({
      message: `${featuredProduct.name}을 가게의 주력 상품으로 설정했어요!`,
      data: featuredProduct,
    });
  } catch (error) {
    console.log(
      `주력 상품으로 등록하는 과정에서 에러가 발생했어요.: ${error.message}`
    );
    res.status(500).json({ error: "intetnal server error" });
  }
};

//상품정보 수정
export const updateProductById = async (req, res) => {
  try {
    const { id: productId } = req.params; //수정할 상품의 id
    const currentUserId = req.user._id; //사장님의 id

    const { name, description, price, category, isFeatured } = req.body;
    let { image } = req.body;

    const product = await Product.findById(productId).select("seller");

    //해당 상품이 없다면
    if (!product) return res.sendStatus(404);

    //자신의 상품인 경우에만 정보 수정 가능
    if (product.seller.toString() !== currentUserId.toString()) {
      return res
        .status(403)
        .json({ error: "상품의 판매자만 상품 정보를 수정할 수 있어요!" });
    }

    //cloudinary의 상품사진 업데이트 - 기존사진 삭제, 새로운 사진 등록
    if (product.image) {
      await cloudinary.uploader.destroy(
        `products/${product.image.split("/").pop().split(".")[0]}`
      );
    }

    //사용자가 새로 입력한 이미지 업로드
    if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products/",
      });
      image = cloudinaryResponse.secure_url;
    }

    //mongoDB에 저장, newProduct는 반환된 수정후 객체
    const newProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        category: category || product.category,
        isFeatured: isFeatured || product.isFeatured,
        image: image || product.image,
      },
      { new: true }
    );

    res.status(200).json({
      message: `${newProduct.name}의 상품정보를 수정했어요!`,
      data: newProduct,
    });
  } catch (error) {
    console.log(`상품정보 수정 과정에서 에러가 발생했어요.: ${error.message}`);
    res.status(500).json({ error: "intetnal server error" });
  }
};

// 특정 가게에 속한 상품 전체 삭제
export const deleteAllProductsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    //현재 로그인된 계정이 판매자가 맞는지 (자신이 판매한 상품만 삭제가능)
    const isMyProduct = sellerId.toString() === req.user._id.toString();

    if (!isMyProduct)
      return res.status(403).json({ error: "자신의 상품만 삭제할 수 있어요." });

    //
    await Product.deleteMany({ seller: sellerId });

    res.status(200).json({ message: "사장님 가게의 모든 상품을 삭제했어요." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "internal server error. progress: deleteAllProductsBySeller",
    });
  }
};

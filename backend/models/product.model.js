// 여행상품 스키마

import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    //각 마켓에 가장 메인으로 보여질 주력상품으로 사장님이 등록을 하였는지
    isFeatured: {
      type: Boolean,
      default: false,
    },
    //판매자
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //상품의 재고
    stock: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

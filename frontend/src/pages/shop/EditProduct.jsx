// 상품정보 수정 페이지
import React, { useState } from "react";

import toast from "react-hot-toast";
import {
  editProductInfo,
  fetchOriginalProductData,
} from "../../utils/axios/shop";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams();

  const [productData, setProductData] = useState({
    image: null,
    name: "",
    price: 0,
    description: "",
    category: "",
    stock: 0,
  });

  // 페이지 로드 시 기존 상품 정보 불러오기
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        //기존 상품 정보를 초기값으로 반영
        const originalProductData = await fetchOriginalProductData(id);

        setProductData({
          image: originalProductData.image || null,
          name: originalProductData.name || "",
          price: originalProductData.price || 0,
          description: originalProductData.description || "",
          category: originalProductData.category || "",
          stock: originalProductData.stock || 0,
        });
      } catch (error) {
        console.error(error);
        toast.error("다시 시도해주세요.");
      }
    };

    fetchProductData();
  }, []);

  const [axiosError, setAxiosError] = useState("");
  const [fileName, setFileName] = useState("선택된 파일 없음");

  const onChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      // 파일 입력 처리
      setProductData({ ...productData, [name]: files[0] });
      setFileName(files[0].name); // 파일 이름 업데이트
    } else {
      // 일반 입력 처리
      setProductData({ ...productData, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = confirm("상품정보를 수정하시겠습니까?");

    if (ok) {
      try {
        await editProductInfo(productData);
        toast.success("상품정보를 수정했어요! 🎉");
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        console.error(errorMessage);
        setAxiosError(errorMessage);

        toast.error("상품정보 수정에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 border-b pb-3">
          수정하실 상품의 정보를 입력해주세요!
        </h1>

        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="flex flex-col">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              제품 사진
            </label>
            <div className="flex items-center space-x-3">
              <label
                htmlFor="image"
                className="cursor-pointer bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
              >
                파일 선택
              </label>
              <input
                type="file"
                id="image"
                className="hidden"
                name="image"
                onChange={onChange}
                required
                accept="image/*" // 이미지 파일만 허용
              />
              <span className="text-sm text-gray-500 truncate" title={fileName}>
                {fileName.length > 30
                  ? fileName.substring(0, 27) + "..."
                  : fileName}
              </span>
            </div>
          </div>

          {[
            {
              id: "name",
              label: "제품명",
              type: "text",
              placeholder: "제품명을 입력해주세요",
              name: "name",
              value: productData.name,
            },
            {
              id: "price",
              label: "상품 가격",
              type: "number",
              placeholder: "상품 가격을 입력해주세요",
              name: "price",
              value: productData.price,
              min: 0,
            },
            {
              id: "description",
              label: "상품 설명",
              type: "text",
              placeholder: "상품에 대한 설명을 입력해주세요",
              name: "description",
              value: productData.description,
            },
            {
              id: "category",
              label: "카테고리",
              type: "text",
              placeholder: "상품의 카테고리를 입력해주세요",
              name: "category",
              value: productData.category,
            },
            {
              id: "stock",
              label: "재고 수량",
              type: "number",
              placeholder: "상품의 재고를 입력해주세요",
              name: "stock",
              value: productData.stock,
              min: 0,
            },
          ].map((field) => (
            <div className="flex flex-col" key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.id}
                placeholder={field.placeholder}
                name={field.name}
                value={field.value}
                onChange={onChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-black"
                required
                {...(field.min !== undefined && { min: field.min })} // min 속성 조건부 추가
              />
            </div>
          ))}

          {/* axios 에러 표시 */}
          {axiosError && (
            <p className="text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-300">
              🚨 에러가 발생했습니다: {axiosError}
            </p>
          )}

          {/* 상품 등록 버튼 */}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-green-500 text-white font-extrabold rounded-lg shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            상품정보 수정하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;

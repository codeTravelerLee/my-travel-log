//여러개의 상품정보가 목록 형태로 표시되는 페이지

import React, { useEffect } from "react";

import { useProductStore } from "../../store/useProductStore";

import ProductItemSkeleton from "../../components/skeletons/ProductItemSkeleton";
import ProductItem from "../../components/products/ProductItem";

const ProductMain = () => {
  const { fetchAllProducts, products, loading, error } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  //TODO: 로딩스피너, 스켈레톤 적용하여 UI개선
  if (error) return <div>상품 정보를 불러오는 과정에서 문제가 발생했어요.</div>;

  //로딩되는 동안 보여줄 스켈레톤의 개수 설정
  const skeletonArray = Array.from({ length: 12 });
  console.log(products);
  return (
    <div
      className="p-4 grid gap-4 
      grid-cols-1       
      sm:grid-cols-2     
      md:grid-cols-3   
      "
    >
      {loading
        ? skeletonArray.map((_, idx) => <ProductItemSkeleton key={idx} />)
        : products?.map((product) => (
            <ProductItem
              key={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
              category={product.category}
              id={product._id}
            />
          ))}
    </div>
  );
};

export default ProductMain;

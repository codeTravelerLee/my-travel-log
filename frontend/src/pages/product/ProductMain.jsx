//여러개의 상품정보가 목록 형태로 표시되는 페이지

import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

import { useProductStore } from "../../store/useProductStore";

import ProductItemSkeleton from "../../components/skeletons/ProductItemSkeleton";
import ProductItem from "../../components/products/ProductItem";

const ProductMain = () => {
  //검색키워드 global state
  const {
    fetchAllProducts,
    searchProducts,
    searchKeyword,
    setSearchKeyword,
    setSort,
    products,
    totalCount,
    loading,
    error,
  } = useProductStore();

  //디바운스를 위한 검색키워드 local state - zustand의 global과 혼동되지 않도록 별도로 관리
  const [searchInputValue, setSearchInputValue] = useState(searchKeyword);

  //실시간 검색에 따른 서버 부하를 막기 위한 디바운싱 - 0.5초
  const debouncedSearch = useCallback(
    debounce((keyword) => {
      searchProducts(keyword);
    }, 500),
    [searchProducts]
  );

  useEffect(() => {
    // 컴포넌트 마운트 시 전체 데이터 fetch
    fetchAllProducts();
  }, [fetchAllProducts]);

  useEffect(() => {
    // 검색어 변경 시 디바운스 적용
    if (searchInputValue.trim() === "") {
      fetchAllProducts();
    } else {
      debouncedSearch(searchInputValue);
    }
  }, [searchInputValue, debouncedSearch, fetchAllProducts]);

  if (error)
    return (
      <div className="flex items-center justify-center w-full h-full text-xl">
        상품 정보를 불러오는 과정에서 문제가 발생했어요.
      </div>
    );

  //로딩되는 동안 보여줄 스켈레톤의 개수 설정
  const skeletonArray = Array.from({ length: 12 });

  return (
    <div className="flex flex-col gap-5 items-center pt-8">
      {/* 검색창 */}
      <div className="flex flex-row gap-2 w-full md:w-1/2 items-center justify-center">
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow "
            placeholder="찾으시는 상품이 있으신가요?"
            value={searchInputValue}
            onChange={(e) => {
              const keyword = e.target.value;

              setSearchInputValue(keyword);
              debouncedSearch(keyword);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();

                setSearchKeyword(searchInputValue);
                searchProducts(searchKeyword);
              }
            }}
          />
        </label>
        <button
          className="btn border-amber-50"
          onClick={() => searchProducts(searchKeyword)}
        >
          검색
        </button>
      </div>

      <div className="flex flex-row gap-8 items-center justify-between w-full pl-5 pr-5 ">
        <p className="text-left">총 {totalCount}개의 상품이 검색되었어요.</p>
        {/* 정렬모달 */}
        <button
          className="btn border-amber-50"
          popoverTarget="popover-1"
          style={{ anchorName: "--anchor-1" }}
        >
          정렬
        </button>

        <ul
          className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" }}
        >
          <li>
            <a
              onClick={() => {
                setSort("price_asc");
              }}
            >
              가격 낮은 순
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                setSort("price_desc");
              }}
            >
              가격 높은 순
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                setSort("newest");
              }}
            >
              최신순
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                setSort("oldest");
              }}
            >
              오래된 순
            </a>
          </li>
        </ul>
      </div>
      {/* 검색된 상품들 카드 형태로 그리드 배치 */}
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
    </div>
  );
};

export default ProductMain;
